import dynamic from "next/dynamic";
const Table = dynamic(() => import("@components/Table"), {
  ssr: false
});
const TitleAndDescriptions = dynamic(
  () => import("@components/TitleAndDescriptions"),
  { ssr: false }
);

const LendWithProtection = () => {
  return (
    <div>
      <TitleAndDescriptions
        title="Lend with Protection"
        descriptions="Earn adjusted yields by purchasing bonds with protection."
        buttonExist={true}
        button="Learn about lending with protection"
      />

      <Table title="All Bonds with Protection" />
    </div>
  );
};

export default LendWithProtection;
