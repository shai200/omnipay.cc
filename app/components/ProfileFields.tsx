import type { ChangeEvent } from 'react';
import type { ProfileFormValues } from '@/lib/profile-form';
import { TextField } from './ui/Field';

// Name, date of birth and address inputs shared by sign-up step two and
// Checkout Settings, so both collect the same data the same way.
export function ProfileFields({
  values,
  onChange,
  disabled,
  dobError,
  countryError,
}: {
  values: ProfileFormValues;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  dobError?: string;
  countryError?: string;
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="First name"
          name="first_name"
          type="text"
          autoComplete="given-name"
          maxLength={100}
          value={values.first_name}
          onChange={onChange}
          disabled={disabled}
        />
        <TextField
          label="Last name"
          name="last_name"
          type="text"
          autoComplete="family-name"
          maxLength={100}
          value={values.last_name}
          onChange={onChange}
          disabled={disabled}
        />
      </div>

      <fieldset aria-describedby="dob-help">
        <legend className="label">Date of birth</legend>
        <div className="grid grid-cols-3 gap-3">
          <TextField
            label="Day"
            name="dob_day"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2}
            placeholder="DD"
            autoComplete="bday-day"
            value={values.dob_day}
            onChange={onChange}
            disabled={disabled}
            aria-invalid={dobError ? true : undefined}
          />
          <TextField
            label="Month"
            name="dob_month"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2}
            placeholder="MM"
            autoComplete="bday-month"
            value={values.dob_month}
            onChange={onChange}
            disabled={disabled}
            aria-invalid={dobError ? true : undefined}
          />
          <TextField
            label="Year"
            name="dob_year"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            placeholder="YYYY"
            autoComplete="bday-year"
            value={values.dob_year}
            onChange={onChange}
            disabled={disabled}
            aria-invalid={dobError ? true : undefined}
          />
        </div>
        {dobError ? <p className="field-error" role="alert">{dobError}</p> : null}
        <p id="dob-help" className="field-hint">
          You must be at least 18 years old to use this service. A date of birth is required before you can buy.
        </p>
      </fieldset>

      <TextField
        label="Country (2-letter code)"
        name="address_country"
        type="text"
        autoComplete="country"
        autoCapitalize="characters"
        maxLength={2}
        placeholder="US"
        value={values.address_country}
        onChange={onChange}
        disabled={disabled}
        error={countryError}
        className="sm:max-w-[14rem]"
      />

      <TextField
        label="Address Line 1"
        name="address_line1"
        type="text"
        autoComplete="address-line1"
        maxLength={200}
        value={values.address_line1}
        onChange={onChange}
        disabled={disabled}
      />
      <TextField
        label="Address Line 2"
        name="address_line2"
        type="text"
        autoComplete="address-line2"
        maxLength={200}
        value={values.address_line2}
        onChange={onChange}
        disabled={disabled}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TextField
          label="City"
          name="address_city"
          type="text"
          autoComplete="address-level2"
          maxLength={200}
          value={values.address_city}
          onChange={onChange}
          disabled={disabled}
        />
        <TextField
          label="State"
          name="address_state"
          type="text"
          autoComplete="address-level1"
          maxLength={200}
          value={values.address_state}
          onChange={onChange}
          disabled={disabled}
        />
        <TextField
          label="Postal code"
          name="address_postal_code"
          type="text"
          autoComplete="postal-code"
          maxLength={32}
          value={values.address_postal_code}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
