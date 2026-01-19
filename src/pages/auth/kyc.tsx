import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/layouts";
import { ArrowLeft } from "lucide-react";
import { ButtonWithLoader, InputWithoutIcon, SelectWithoutIcon } from "@/components/ui";
import { type KYCType, kycSchema } from "@/schemas/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuth from "@/hooks/useAuth";
import { Country, State, City } from "country-state-city";
import type { ICountry, IState, ICity } from "country-state-city";
import { useEffect, useMemo } from "react";

export default function KYC() {
  const navigate = useNavigate();
  const { kyc, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<KYCType>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      address: {
        country: "Nigeria",
      },
    },
  });

  // Get Nigeria country code
  const nigeria = useMemo(() => {
    return Country.getAllCountries().find((c: ICountry) => c.name === "Nigeria");
  }, []);

  // Get all Nigerian states
  const nigerianStates = useMemo(() => {
    if (!nigeria) return [];
    return State.getStatesOfCountry(nigeria.isoCode).map((state: IState) => ({
      label: state.name,
      value: state.name,
    }));
  }, [nigeria]);

  // Watch selected state
  const selectedState = watch("address.state");

  // Get cities filtered by selected state
  const stateCities = useMemo(() => {
    if (!selectedState || !nigeria) return [];
    
    // Find the state by name
    const state = State.getStatesOfCountry(nigeria.isoCode).find(
      (s: IState) => s.name === selectedState
    );
    
    if (!state) return [];
    
    // Get cities for that state
    const cities = City.getCitiesOfState(nigeria.isoCode, state.isoCode);
    return cities.map((city: ICity) => ({
      label: city.name,
      value: city.name,
    }));
  }, [selectedState, nigeria]);

  // Reset city when state changes
  useEffect(() => {
    if (selectedState) {
      setValue("address.city", "");
    }
  }, [selectedState, setValue]);
  
  
  const onSubmit = async (data: KYCType) => {
    await kyc(data);
  };

  return (
    <AuthLayout>
      <div className="bg-white p-8 md:p-10">

        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-main uppercase font-space mb-3">
            Complete Your Profile
          </h1>
          <p className="text-muted text-sm md:text-base">
            Please provide your information to continue
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithoutIcon
              label="First Name *"
              type="text"
              {...register("firstName")}
              error={errors.firstName?.message}
              className="bg-secondary"
            />

            <InputWithoutIcon
              label="Last Name *"
              type="text"
              {...register("lastName")}
              error={errors.lastName?.message}
              className="bg-secondary"
            />
            <InputWithoutIcon
              label="Phone Number *"
              type="tel"
              {...register("phone")}
              error={errors.phone?.message}
              className="bg-secondary"
            />
            <SelectWithoutIcon
              label="Country *"
              {...register("address.country")}
              error={errors.address?.country?.message}
              options={[{ label: "Nigeria", value: "Nigeria" }]}
              defaultValue="Nigeria"
              className="bg-secondary"
              disabled
            />
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectWithoutIcon
              label="State *"
              {...register("address.state")}
              error={errors.address?.state?.message}
              options={nigerianStates}
              defaultValue="Select State"
              className="bg-secondary"
            />
            <SelectWithoutIcon
              label="City *"
              {...register("address.city")}
              error={errors.address?.city?.message}
              options={stateCities}
              defaultValue={selectedState ? "Select City" : "Select State First"}
              className="bg-secondary"
              disabled={!selectedState}
            />
          </div>
          <div>
            <InputWithoutIcon
              label="Street Address *"
              type="text"
              {...register("address.street")}
              error={errors.address?.street?.message}
              className="bg-secondary"
            />
          </div>

          <ButtonWithLoader
            type="submit"
            loading={isLoading}
            initialText="Complete Registration"
            loadingText="Completing Profile..."
            className="w-full flex items-center justify-center gap-2 h-12 py-4 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </form>
        <button
          onClick={() => navigate("/auth/verify-otp")}
          className="h-12 w-full btn font-space border border-line mt-4 text-muted hover:text-main hover:bg-line transition-all duration-300"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      </div>
    </AuthLayout>
  );
}
