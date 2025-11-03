import { ITherapistProfileRepo } from "@application/interfaces/ITherapistProfileRepo";
import { TherapistProfile } from "@domain/entities/TherapistProfile";

export class GetTherapistProfileByUserIdUseCase {
  constructor(private therapistProfileRepo: ITherapistProfileRepo) {}

  async execute(userId: string): Promise<TherapistProfile | null> {
    const profile = await this.therapistProfileRepo.findByUserId(userId);
    return profile;
  }
}
