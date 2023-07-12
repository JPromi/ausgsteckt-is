import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { AllHeurigenService } from "../../services/all-heurigen.service";

@Component({
  selector: 'app-all-heurigen',
  templateUrl: './all-heurigen.component.html',
  styleUrls: ['./all-heurigen.component.scss']
})
export class AllHeurigenComponent {

  heurigen:any;
  parameter:any;

  constructor(private service:AllHeurigenService, private route: ActivatedRoute, private router: Router) {

    this.route.queryParams.subscribe(response => {
      this.parameter = response;
    }
    );
  }

  ngOnInit() {
    this.service.getPosts()
      .subscribe(response => {
        this.heurigen = response;
      }
    );
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }
}
