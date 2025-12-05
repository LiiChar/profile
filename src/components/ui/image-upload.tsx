'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from './button';

interface ImageUploadProps {
	defaultImage?: string;
	onSelect: (base64: string | null) => void;
	className?: string;
}

export function ImageUpload({
	onSelect,
	defaultImage,
	className = '',
}: ImageUploadProps) {
	const [preview, setPreview] = useState<string | null>(defaultImage ?? null);
	const [loading, setLoading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const toBase64 = (file: File): Promise<string> =>
		new Promise((res, rej) => {
			const reader = new FileReader();
			reader.onload = () => res(reader.result as string);
			reader.onerror = rej;
			reader.readAsDataURL(file);
		});

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return onSelect(null);
		if (!file.type.startsWith('image/')) return alert('Выбери изображение');

		setLoading(true);

		try {
			const base64 = await toBase64(file);

			// — задержка 2 секунды
			setTimeout(() => {
				setPreview(base64);
				onSelect(base64);
				setLoading(false);
			}, 2000);
		} catch {
			setLoading(false);
		}
	};

	return (
		<div
			className={`
        relative inline-block
        group focus-within:preview-active hover:preview-active
        ${className}
      `}
		>
			{/* Hidden input */}
			<input
				ref={inputRef}
				type='file'
				accept='image/*'
				className='hidden'
				onChange={handleChange}
			/>

			{/* Upload button */}
			<Button
				onClick={() => inputRef.current?.click()}
				loading={loading}
			>
				Загрузить
			</Button>


			{/* Floating preview */}
			{preview && (
				<div
					className='
            absolute w-full left-1/2 top-full mt-3 -translate-x-1/2
             rounded-xl border shadow-lg
            opacity-0 pointer-events-none
            transition-all duration-200 ease-out
            group-hover:opacity-100
            z-10
          '
				>
					<Image
						src={preview}
						alt='Preview'
						width={260}
						height={260}
						className='rounded-lg max-h-60 object-contain'
					/>
				</div>
			)}
		</div>
	);
}
