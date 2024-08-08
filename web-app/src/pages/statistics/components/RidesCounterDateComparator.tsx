import { useMemo } from "react";
import { SearchRidesQuery } from "@/gql/graphql";
import Comparator from "../../../components/charts/Comparator";
import { getMonthWithId } from "@/utils/date.utils";
import {
  checkRideMonthAndYearEquality,
  getTotalEmissions,
} from "@/utils/ride.utils";
import PieChartRidesCounter from "./charts/PieChartRidesCounter";
import { RideData } from "@/type/RideData.type";
import PieChartRidesEmissions from "./charts/PieChartRidesEmissions";
import { CO2_KG_UNIT_LABEL } from "@/charts.constants";

interface RidesCounterDateComparatorProps {
  data: SearchRidesQuery | undefined;
  currentRides: RideData[];
  month: number;
  year: number;
}

const RidesCounterDateComparator = ({
  data,
  currentRides = [],
  month,
  year,
}: RidesCounterDateComparatorProps) => {
  const prevRides = useMemo(() => {
    if (!data || !data.searchRides) {
      return [];
    }
    return data.searchRides.filter((ride) =>
      month === 0
        ? checkRideMonthAndYearEquality(ride.date, 11, year - 1)
        : checkRideMonthAndYearEquality(ride.date, month - 1, year)
    );
  }, [data, month, year]);

  const nextRides = useMemo(() => {
    if (!data || !data.searchRides) {
      return [];
    }
    return data.searchRides.filter((ride) =>
      month === 11
        ? checkRideMonthAndYearEquality(ride.date, 0, year + 1)
        : checkRideMonthAndYearEquality(ride.date, month + 1, year)
    );
  }, [data, month, year]);

  const baseElementLabel = getMonthWithId(month);
  const prevElementLabel = month === 0 ? getMonthWithId(11) : getMonthWithId(month - 1);
  const nextElementLabel = month === 11 ? getMonthWithId(0) : getMonthWithId(month + 1);

  return (
    <Comparator
      baseElement={{
        label: baseElementLabel,
        comparatedValues: [
          {
            label: "trajets",
            value: currentRides.length,
          },
          {
            label: CO2_KG_UNIT_LABEL,
            value: getTotalEmissions(currentRides),
          },
        ],
      }}
      comparatedElements={[
        {
          label: prevElementLabel,
          comparatedValues: [
            {
              label: "trajets",
              value: prevRides.length,
              optionalNode: <PieChartRidesCounter rides={prevRides} />,
            },
            {
              label: CO2_KG_UNIT_LABEL,
              value: getTotalEmissions(prevRides),
              optionalNode: <PieChartRidesEmissions rides={prevRides} />,
            },
          ],
        },
        {
          label: nextElementLabel,
          comparatedValues: [
            {
              label: "trajets",
              value: nextRides.length,
              optionalNode: <PieChartRidesCounter rides={nextRides} />,
            },
            {
              label: CO2_KG_UNIT_LABEL,
              value: getTotalEmissions(nextRides),
              optionalNode: <PieChartRidesEmissions rides={nextRides} />,
            },
          ],
        },
      ]}
    />
  );
};

export default RidesCounterDateComparator;
