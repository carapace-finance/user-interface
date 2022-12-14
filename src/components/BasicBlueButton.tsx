// import React, {FC, useState} from "react";

// type Props = {
//   label: string
// }

// const BasicButton: FC<Props> = (props) => {
//   const { label} = props
//   const [active, setActive] = useState(false);
//   const handleClick = () => {
//     setActive(!active);
//   };



//     return (
//         <button
//             className={active ?
//               "rounded-xl py-2 px-7 bg-customBlue text-white text-xs"
//               :
//               "rounded-xl py-2 px-7 text-xs bg-customLightGrey border border-gray-200 text-gray-500"
//             }
//             onClick={handleClick}
//         >
//             {label}
//         </button>
//     )
// }

// export default React.memo(BasicButton)
