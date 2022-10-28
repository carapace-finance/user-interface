import { useRouter } from "next/router";

const Bond = () => {
  const router = useRouter();
  const bondId = router.query.id;

  return <div>Bond #{bondId}</div>;
};

export default Bond;
