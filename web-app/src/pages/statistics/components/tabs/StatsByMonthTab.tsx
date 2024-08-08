import SelectWithNavigation from "@/components/navs/SelectWithNavigtion";
import { getNumberFormatedToTwoDecimals } from "@/utils/maths.utils";
import { Grid, Stack, Typography } from "@mui/material";
import BarChartMonthEmissions from "../charts/BarChartMonthEmissions";
import { SearchRidesQuery } from "@/gql/graphql";
import { useMemo, useState } from "react";
import { getMonthWithId } from "@/utils/date.utils";
import {
  checkRideMonthAndYearEquality,
  getTotalEmissions,
} from "@/utils/ride.utils";
import PieChartRidesCounter from "../charts/PieChartRidesCounter";
import PieChartRidesEmissions from "../charts/PieChartRidesEmissions";
import RidesCounterDateComparator from "../RidesCounterDateComparator";
import { capitalizeFirstLetter } from "@/utils/typo.utils";
import StatCard from "../StatCard";
import SubHeader from "@/components/headers/SubHeader";
import { CO2_KG_UNIT_LABEL } from "@/charts.constants";

interface StatsByMonthTabProps {
  data: SearchRidesQuery | undefined;
}

const StatsByMonthTab = ({ data }: StatsByMonthTabProps) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const rides = useMemo(() => {
    if (!data || !data.searchRides) {
      return [];
    }
    return data.searchRides.filter((ride) =>
      checkRideMonthAndYearEquality(ride.date, selectedMonth, selectedYear)
    );
  }, [data, selectedMonth, selectedYear]);

  const CO2ByMonthAndYear = useMemo(() => {
    if (!data || !data.searchRides) {
      return 0;
    }
    return getTotalEmissions(rides);
  }, [rides]);

  const monthSelectItems = useMemo(
    () => Array.from({ length: 12 }, (_, i) => ({ label: getMonthWithId(i), value: i })),
    []
  );

  const yearSelectItems = useMemo(
    () => Array.from({ length: 125 }, (_, i) => {
      const year = i + 1900;
      return { label: year, value: year };
    }),
    []
  );

  return (
    <Grid container height="100%" px={{ xs: 0, md: 4 }}>
      <SubHeader
        leftChildren={
          <Typography
            variant="h2"
            display={{ xs: "none", md: "block" }}
          >{`${capitalizeFirstLetter(getMonthWithId(selectedMonth))} ${selectedYear}`}</Typography>
        }
        rightChildren={
          <Stack direction="row" justifyContent="flex-end">
            <SelectWithNavigation
              isRightButtonEnable={
                new Date(selectedYear, selectedMonth + 1) <= new Date()
              }
              handleSelectChange={(value) => setSelectedMonth(value as number)}
              selectItems={monthSelectItems}
              selectValue={{ label: getMonthWithId(selectedMonth), value: selectedMonth }}
            />

            <SelectWithNavigation
              isReversed
              handleSelectChange={(value) => setSelectedYear(value as number)}
              selectItems={yearSelectItems}
              selectValue={{ label: selectedYear, value: selectedYear }}
            />
          </Stack>
        }
      />

      <Grid container item direction={{ xs: "row", md: "row-reverse" }}>
        <Grid container item xs={12} md={4} alignItems="flex-end">
          <Grid item xs={6} justifyContent="center">
            <StatCard
              value={rides.length}
              label="trajets"
              pieChart={<PieChartRidesCounter rides={rides} />}
            />
          </Grid>
          <Grid item xs={6}>
            <StatCard
              value={getNumberFormatedToTwoDecimals(CO2ByMonthAndYear)}
              label={CO2_KG_UNIT_LABEL}
              pieChart={<PieChartRidesEmissions rides={rides} />}
            />
          </Grid>
          <Grid item xs={12}>
            {data && (
              <RidesCounterDateComparator
                data={data}
                currentRides={rides}
                month={selectedMonth}
                year={selectedYear}
              />
            )}
          </Grid>
        </Grid>
        <Grid container item xs={12} md={8} alignItems="flex-end">
          {data && (
            <BarChartMonthEmissions
              data={data}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default StatsByMonthTab;
