import {Component, Input, OnInit} from '@angular/core';
import { TopRestaurantService} from "../top-restaurant.service";
import { UserRecommendationService} from "../user-recommendation.service";
import {UserFilterService} from "../user-filter.service";

@Component({
  selector: 'app-dashboard-user',
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.css']
})
export class DashboardUserComponent implements OnInit {

  public years: number[];
  quarters = [
    {
      "name": "First",
      "value": "quarter1"
    },
    {
      "name": "Second",
      "value": "quarter2"
    },
    {
      "name": "Third",
      "value": "quarter3"
    },
    {
      "name": "Fourth",
      "value": "quarter4"
    }
  ];
  selectedQuarter = 'quarter1';
  selectedYear = 2017;
  zipCode;
  public api_recomd_result;
  public restaurants = [];
  public recommendations = [];

  constructor(private restservice:TopRestaurantService, private userservice: UserRecommendationService, private userfilter:UserFilterService ) {
    let yearsList = [];
    for (let i = 2018; i >= 1900; i--) {
      yearsList.push(i);
    }
    this.years = yearsList;
  }

  ngOnInit() {
    this.search();
    this.getTopRest();
    this.getUserRecommendations();
  }

  search() {
    this.userfilter.setFilterValues(this.zipCode, this.selectedQuarter, this.selectedYear);
    this.getTopRest();
  }

  getTopRest () {
    this.restservice.getResponse().subscribe((data) => {
      console.log(data['business_list']);
      let temp = [];

      for( let key in data['business_list']) {
        temp.push(data['business_list'][key]);
      }

      temp.sort((a,b) => {
        return a.rank - b.rank;
      });

      temp = temp.slice(0, temp.length - 2);

      this.restaurants = temp;
      console.log("REST ", this.restaurants);
    });
  }

  getUserRecommendations() {
    this.userservice.getUserRecommendation().subscribe( (data) => {
      this.api_recomd_result = data['response'];
      let temp = [];

      for( let key in this.api_recomd_result ) {
        temp.push(this.api_recomd_result[key]);
      }

      temp = temp.slice(0, temp.length - 1);

      this.recommendations = temp;
      console.log(this.recommendations);
    });
  }
}
