import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { type ChartData } from 'chart.js';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { ProductService } from '../../services/product-service';
import { ProductParams } from '../../models/filters/productParams';
import { Product } from '../../models/product';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [RouterLink,ChartjsComponent],
  templateUrl: './admin-page.html',
  styleUrls: ['./admin-page.css']
})
export class AdminPage implements OnInit {

  
  constructor(
  private router : Router,
  private productService: ProductService
  ){}

  data?: ChartData

  ngOnInit(): void {
this.getData()
  }

getData() {
    const params: ProductParams = {
      sort: "soldQuantity,desc",
      page: 0,
      size: 8
    }
    this.productService.getList(params).subscribe({
      next: (value) => {

        const productNames = value.data.map(product => product.name);
        const soldQuantities = value.data.map(product => product.soldQuantity);
       
        this.data = {
          labels: productNames,
          datasets: [
            {
              label: 'Productos más vendidos',
              backgroundColor: '#5f56c2ff',
              borderColor: '#5f56c2',
              data: soldQuantities 
            }
          ]
        };


        

        

      },
    })
  }


createProduct(){
  this.router.navigate(["auth/admin/createP"]);
}

}

