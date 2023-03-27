import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function LoadingSkeleton(props) {
  return <Skeleton {...props} baseColor="#f9f9ff" highlightColor="#efeff9" />;
}
