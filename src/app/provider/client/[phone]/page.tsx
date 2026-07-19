"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Loader2, ArrowLeft, User, Phone, Star, MessageSquare } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import UserDropdown from '@/components/UserDropdown';

type Review = {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  provider: {
    name: string;
    avatarUrl: string | null;
  };
};

export default function ClientProfilePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const phone = decodeURIComponent(params.phone as string);
  const clientName = searchParams.get('name') || 'Client';

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [clientData, setClientData] = useState<any>(null);
  
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      fetch('/api/providers/me')
        .then(res => res.json())
        .then(data => {
          if (data.provider) setProfile(data.provider);
        })
        .catch(console.error);
    });

    fetchReviews();
    fetchClientProfile();
  }, [phone, router]);

  const fetchClientProfile = async () => {
    try {
      const res = await fetch(`/api/provider/client-profile?phone=${encodeURIComponent(phone)}`);
      if (res.ok) {
        const data = await res.json();
        setClientData(data.client);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await fetch(`/api/provider/client-reviews?phone=${encodeURIComponent(phone)}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/provider/client-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientPhone: phone,
          rating: newRating,
          comment: newComment
        })
      });

      if (res.ok) {
        setNewRating(5);
        setNewComment('');
        fetchReviews(); // Refresh the list
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : 'New';

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const displayClientName = clientData?.name || clientName;

  return (
    <div className="min-h-screen bg-slate-50 w-full font-sans">
      <header className="h-14 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center sticky top-0 z-30 shadow-sm">
        <div className="text-slate-800 font-medium flex items-center gap-2 text-sm">
          <Link href="/dashboard/orders" className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </Link>
          <span className="text-slate-300 mx-2">/</span>
          <span className="text-slate-900 font-bold truncate max-w-[150px] sm:max-w-none">{profile?.name || 'Loading...'}</span>
          <span className="text-slate-400">| Client Profile</span>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-[1000px] mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Left Column: Profile Info & Submit Review */}
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            
            {/* Client Info Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm overflow-hidden">
                {clientData?.avatarUrl ? (
                  <img src={clientData.avatarUrl} alt={displayClientName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold">{displayClientName.charAt(0)}</span>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{displayClientName}</h2>
              <div className="flex items-center justify-center gap-1.5 text-slate-500 mt-2 text-sm">
                <Phone className="w-4 h-4" />
                {phone}
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between px-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-1">
                    {avgRating} <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Rating</div>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{reviews.length}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Reviews</div>
                </div>
              </div>
            </div>

            {/* Leave a Review Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Leave Feedback
              </h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star className={`w-8 h-8 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-50'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Comment (Optional)</label>
                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    placeholder="How was the experience?"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-bold transition-colors disabled:opacity-70"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Reviews List */}
          <div className="w-full md:w-2/3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Provider Feedback</h2>
            
            {reviewsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No reviews for this client yet.</p>
                <p className="text-sm text-slate-400 mt-1">Be the first to leave feedback!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                          {review.provider.avatarUrl ? (
                            <img src={review.provider.avatarUrl} alt={review.provider.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900">{review.provider.name}</div>
                          <div className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                        <span className="font-bold text-sm text-amber-700">{review.rating}</span>
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-slate-700 pl-13">"{review.comment}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
