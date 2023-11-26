import { memo } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface lazyImagecustomProps {
    src: string;
    alt?: string;
    className?: string;
    style?: any;
    size?: [number, number]
}

function LazyImageCustom({ src, alt, className, style, size = [200, 200] }: lazyImagecustomProps) {
    return (
        <LazyLoadImage style={style} src={src} alt={alt} className={className} />
    )
}

export default memo(LazyImageCustom, (prevProps: any, nextProps: any) => prevProps.src === nextProps.src);