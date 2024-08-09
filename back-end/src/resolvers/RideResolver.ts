import {
  Arg,
  Args,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
  createMethodDecorator,
} from "type-graphql";

import Ride from "../entities/ride";
import { CreateOrUpdateRide, FilterRide } from "../entities/ride.args";
import { Context } from "..";
import User from "../entities/user";

export function RideOwner() {
  return createMethodDecorator(async ({ args, context }, next) => {
    if (await (context as Context).user?.isRideOwner(args.id)) {
      return next();
    }
    throw new Error("You must own the ad to perform this action.");
  });
}

@Resolver()
export class RideResolver {
  @Authorized()
  @Query(() => [Ride])
  rides() {
    return Ride.getRides();
  }

  @Authorized()
  @Query(() => [Ride])
  searchRides(
    @Args(() => FilterRide) args: FilterRide,
    @Ctx() { user }: Context
  ) {
    return Ride.searchRides({ ...args, owner: user as User });
  }

  @Authorized()
  @Query(() => Ride)
  ride(@Arg("id", () => ID) id: string) {
    return Ride.getRideById(id);
  }

  @Authorized()
  @Mutation(() => Ride)
  createRide(@Args() args: CreateOrUpdateRide, @Ctx() { user }: Context) {
    return Ride.createRide({ ...args, owner: user as User });
  }

  @Authorized()
  @RideOwner()
  @Mutation(() => Ride)
  updateRide(
    @Arg("id", () => ID) id: string,
    @Args() args: CreateOrUpdateRide
  ) {
    return Ride.updateRide(id, args);
  }

  @Authorized()
  @RideOwner()
  @Mutation(() => Ride)
  async deleteRide(@Arg("id", () => ID) id: string) {
    return Ride.deleteRide(id);
  }
}
