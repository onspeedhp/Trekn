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
        <LazyLoadImage style={style} src={`https://imgproxy-l6di.onrender.com/sig/rs:fit:${size[0]}:${size[1]}:0/g:sm/${Buffer.from(src, 'utf8').toString('base64')}`} alt={alt} className={className} />
    )
}

export default memo(LazyImageCustom, (prevProps: any, nextProps: any) => prevProps.src === nextProps.src);