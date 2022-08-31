import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Country, Borders } from '../interfaces/res-country.interface';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private _Regions: string[] = [
    'Africa',
    'America',
    'Asia',
    'Europe',
    'Oceania',
  ];

  private _url: string = 'https://restcountries.com/v3.1';

  constructor(private _http: HttpClient) {}

  get regions(): string[] {
    return [...this._Regions];
  }

  getCountriesByRegion(nameRegion: string): Observable<Country[]> {
    if (!nameRegion) return of([]);
    return this._http.get<Country[]>(
      `${this._url}/region/${nameRegion}?fields=name,ccn3`
    );
  }

  getBordersByCodeOfCountry(code: string): Observable<Borders | null> {
    if (!code) return of(null);
    return this._http.get<Borders>(`${this._url}/alpha/${code}?fields=borders`);
  }

  // private _getCountry(code: string): Observable<Country> {
  //   return this._http.get<Country>(
  //     `${this._url}/alpha/${code}?fields=name,ccn3`
  //   );
  // }

  // getBordersName(data: Borders | null): Observable<Country[]> {
  //   if (!data) return of([]);

  //   // const requests: Observable<Country>[] = [];

  //   // data.borders.forEach((codigo) => {
  //   //   const request = this._getCountry(codigo);
  //   //   requests.push(request);
  //   // });

  //   const requestSearchCountry = data.borders.map((code) =>
  //     this._getCountry(code)
  //   );

  //   return combineLatest(requestSearchCountry);
  // }

  // // best method
  getBordersName(data: Borders | null): Observable<Country[]> {
    if (!data) {
      return of([]);
    }

    if (data.borders.length > 0) {
      const bordersList = data.borders.toString();
      return this._http.get<Country[]>(
        `${this._url}/alpha?codes=${bordersList}&fields=name,ccn3`
      );
    }

    return of([]);
  }
}
