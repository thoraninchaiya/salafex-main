<template>
  <v-app>
    <v-carousel cycle height="750" hide-delimiter-background show-arrows-on-hover>
      <v-carousel-item v-for="(slide, i) in carousel" :key="i">
        <v-sheet :image="carousel[i]" height="100%">
          <v-row class="fill-height" align="center" justify="center">
            <v-img height="" :src="`${slide.image}`"></v-img>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>

    <!-- <pre>{{ user }}</pre> -->
    <!-- <pre> {{carddata}} </pre> -->
    <!-- <pre>{{ token }}</pre> -->

    <v-container grid-list-xs>
      <div class="mt-5">
        <div class="d-lg-flex justify-center">
          <v-app>
            <v-card>
              <!-- <Info-Product/> -->
              <v-card-title class="justify-center">
                <div class="display-1">
                  <h4>สินค้าใหม่</h4>
                </div>
              </v-card-title>
              <v-divider></v-divider>
              
            <div v-if="carddata.status != 404">
              <v-card-text class="d-flex align-content-start flex-wrap">
                  <Card-Product v-for="post in carddata" :key="post.secretid" :post="post" />
              </v-card-text>              
            </div>
            <div v-else>
              ไม่พบมีสินค้าในขณะนี้
            </div>

            </v-card>
          </v-app>
        </div>
      </div>      
    </v-container>

  </v-app>
</template>

<script>
import {Core} from '@/vuexes/core'
import {User} from '@/vuexes/auth'
import MainCard from '@/components/Card/Product'
  export default{
    components:{
      MainCard
    },
    data () {
      return {
        carousel: [],
        carddata: [],
        user: {},
      }
    },
    async Request(){
      await getProducts();
      await getCarousel();
    },
    async created() {
      await this.getProducts();
      await this.getCarousel();
      // await this.checkUser();
      // this.user = await User.getUser();
    },
    methods: {
      async getProducts(){
        // this.carddata = await Core.get(`/product/new`)
        var cardrawdata = await Core.get(`/product/new`)
        this.carddata = cardrawdata
      },
      async getCarousel(){
        this.carousel = await Core.get(`/carousel/`)
      },
      async checkUser(){
        let token = User.token
        if(token){
          this.user = await User.getUser();
        }
      }
    }
  }
</script>

<style>

</style>