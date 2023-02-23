import css from "./index.module.css";

export default function Spinner({
  klass = ""
}: {
  klass?: string;
}): JSX.Element {
  return <div className={css.loader} />;
}
