interface SkeletonProps {
  className?: string;
}

function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`skeleton rounded ${className}`} />;
}

export default Skeleton;
