import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Country } from '../../interfaces/res-country.interface';
import { CountryService } from '../../service/country.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.sass'],
})
export class SelectorPageComponent implements OnInit {
  formSelector: FormGroup = this._fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  regions: string[] = [];
  countries: Country[] = [];
  // borders: string[] = [];
  borders: Country[] = [];
  loading: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _countryService: CountryService
  ) {}

  ngOnInit(): void {
    this.regions = this._countryService.regions;

    //When the region changes
    this.formSelector
      .get('region')
      ?.valueChanges.pipe(
        tap((_) => {
          this.loading = true;
          this.formSelector.get('country')?.reset('');
          // this.countries = [];
        }),
        switchMap((nameRegion) =>
          this._countryService.getCountriesByRegion(nameRegion)
        )
      )
      .subscribe({
        next: (data) => {
          this.countries = data;
          this.loading = false;
        },
      });

    //When the Country changes
    this.formSelector
      .get('country')
      ?.valueChanges.pipe(
        tap((_) => {
          this.formSelector.get('border')?.reset('');
          this.loading = true;
          // this.borders = [];
        }),

        switchMap((code) =>
          this._countryService.getBordersByCodeOfCountry(code)
        ),
        switchMap((borders) => this._countryService.getBordersName(borders))
      )
      .subscribe({
        next: (data) => {
          this.borders = data;
          this.loading = false;
        },
      });
  }

  save() {
    console.table(this.formSelector.value);
  }

  // searchCountries() {
  //   const selectedRegion: string = this.formSelector.get('region')?.value;
  // }

  // search in service

  //   if (selectedRegion) this.searchByRegion(selectedRegion);
  //   this.countries = [];
  //   this.formSelector.get('country')?.setValue('');
  // }

  // private searchByRegion(nameRegion: string) {
  //   this._countryService
  //     .getCountriesByRegion(nameRegion)
  //     .subscribe({ next: (data) => (this.countries = data) });
  // }
}
