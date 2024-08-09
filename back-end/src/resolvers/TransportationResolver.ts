import { Arg, Args, Authorized, ID, Mutation, Query, Resolver } from "type-graphql";
import Transportation from "../entities/transportation";
import { CreateOrUpdateTransportation } from "../entities/transportation.args";

@Resolver()
export class TransportationResolver {
  @Authorized()
  @Query(() => [Transportation])
  transportations() {
    return Transportation.getTransportations();
  }

  @Authorized()
  @Query(() => Transportation)
  transportation(@Arg("id", () => ID) id: number) {
    return Transportation.getTransportationById(id);
  }

  @Authorized()
  @Mutation(() => Transportation)
  createTransportation(@Args() args: CreateOrUpdateTransportation) {
    return Transportation.createTransportationIfNotExisting({ ...args });
  }

  @Authorized()
  @Mutation(() => Transportation)
  updateTransportation(
    @Arg("id", () => ID) id: number,
    @Args() args: CreateOrUpdateTransportation
  ) {
    return Transportation.updateTransportation(id, args);
  }

  @Authorized()
  @Mutation(() => Transportation)
  async deleteTransportation(@Arg("id", () => ID) id: number) {
    return Transportation.deleteTransportation(id);
  }
}
