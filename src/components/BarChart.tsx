import React, {FC} from "react";

type Props = {
  filledPercentage: number
}

const BarChart: FC<Props> = (props) => {
  const { filledPercentage} = props

    return (
        <div
            className={
              "bg-customGraphGrey overflow-clip box-border h-[24px] rounded-xl text-xs border border-gray-200 "
            }
        >
          <div className={
              "ml-[-3%] min-h-full overflow-clip rounded-xl text-xs bg-white right-border-customGraphGrey"
            } style={{
              width:`calc(3% + ${filledPercentage}%)`
            }}> 
          </div>
        </div>
    )
}
export default React.memo(BarChart)
