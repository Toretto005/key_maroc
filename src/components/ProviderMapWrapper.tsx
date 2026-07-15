"use client";

import dynamic from 'next/dynamic';

const ProviderMap = dynamic(() => import('./ProviderMap'), { ssr: false });

type Props = {
  lat: number;
  lng: number;
  name: string;
  address: string;
};

export default function ProviderMapWrapper(props: Props) {
  return <ProviderMap {...props} />;
}
