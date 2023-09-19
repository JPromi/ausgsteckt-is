import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Heuriger } from 'src/app/dtos/heuriger';
import { HeurigerService } from 'src/app/services/heuriger.service';



@Component({
  selector: 'app-all-heurigen',
  templateUrl: './all-heurigen.component.html',
  styleUrls: ['./all-heurigen.component.scss']
})
export class AllHeurigenComponent {

  heurigen:any;
  parameter:any;

  constructor(private heurigenService:HeurigerService, private route: ActivatedRoute, private router: Router) {

    this.route.queryParams.subscribe(response => {
      this.parameter = response;
    }
    );
  }

  ngOnInit() {
    this.heurigenService.getAllHeurigen()
      .subscribe((response: Heuriger[]) => {
        this.heurigen = response;
      }
    );
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }
}
