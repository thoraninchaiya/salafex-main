<template>
<v-container grid-list-xs>
    <v-card>
        <v-card-title primary-title>
            ทำการสั่งซื้อ
        </v-card-title>

    </v-card>

    <v-card class="mt-3">
        <v-card-text>
            <p class="font-weight-bold">ที่อยู่ในการจัดส่ง</p>
            <v-divider></v-divider>
            {{userdata.addr}}
        </v-card-text>
    </v-card>

    <v-card class="mt-3">
        <v-card-text>

            <!-- <pre>
            {{companylist}}
            {{senddelivery}}
            </pre> -->

            <p class="font-weight-bold">รายการสินค้า</p>
            <v-divider></v-divider>
            <v-card-text>
                <v-simple-table>
                    <template>
                        <thead>
                            <tr>
                                <th></th>
                                <th>สินค้า</th>
                                <th>ราคาต่อชิ้น</th>
                                <th>จำนวน</th>
                                <th>ราคารวม</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <template>
                                <tr v-for="item in checkoutcart" :key="item.cid">
                                    <td>
                                        <v-img class="cartimage" :src="`${item.image}`"></v-img>
                                    </td>
                                    <td>{{ item.name }}</td>
                                    <td>&#3647;&nbsp;{{ item.price }}</td>
                                    <td>
                                        <div class="d-inline-flex">
                                            <div>
                                                <v-btn color="success" small @click="removeone(item.cid, item.productid, item.qty)">-</v-btn>
                                            </div>
                                            <div class="ma-1">{{ item.qty }}</div>
                                            <div>
                                                <v-btn color="success" small @click="addone(item.cid, item.productid, item.qty)">+</v-btn>
                                            </div>
                                        </div>
                                    </td>
                                    <td>&#3647;&nbsp;{{ item.price * item.qty }}</td>
                                    <td>
                                        <div>
                                            <v-btn color="error" small @click="removeitem(item.cid, item.productid)">ลบ</v-btn>
                                        </div>
                                    </td>
                                </tr>
                                <!-- <tr>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                      <td>ราคารวม</td>
                                      <td>price</td>
                                  </tr> -->
                            </template>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card-text>
        </v-card-text>
    </v-card>
    <v-card class="mt-3">
        <v-card-text>
            <p class="font-weight-bold">บริษัทขนส่ง</p>
            <v-divider></v-divider>
            <div>
                <v-radio-group v-model="senddelivery.delivery_id" required>
                    <v-radio :label="item.deli_companyu_name" :value="item.deli_companyu_id" v-for="item, i in companylist" :key="i"></v-radio>
                </v-radio-group>
            </div>
            <v-divider></v-divider>
            <div class="d-flex justify-end">
                <v-btn color="success" @click="checkout()">ยืนยันการสั่งซื้อสินค้า</v-btn>
            </div>
        </v-card-text>
    </v-card>
</v-container>
</template>

<script>
import { Core } from "@/vuexes/core";
import { User } from "@/vuexes/auth";

export default {
    data: () => {
        return ({
            senddelivery: {
                delivery_id: null
            },
            userdata: {},
            checkoutcart: {},
            remove: {
                cid: 0
            },
            add: {},
            cartstock: {
                cid: {},
                productid: {},
                qty: 0,
                status: null
            },
            companylist: {},
        })
    },
    async created() {
        await this.checkUser();
        await this.getdeliverycompany();
    },
    computed: {

    },
    methods: {
        async checkUser() {
            let token = User.token;
            if (token) {
                this.userdata = await Core.get(`/user/profile`)
                await this.getcart();
            }
        },
        async getcart() {
            const checkoutraw = await Core.get(`/cart/get`)
            this.checkoutcart = checkoutraw.cart
        },
        async checkout() {
            var checkout = await Core.post(`/purchase/checkout`, this.senddelivery)
            if (checkout.status == 200) {
                this.$router.push('/payment')
            }
            if (checkout) {
                this.toast(checkout.status, checkout.message)
            }
        },
        async removeitem(itemid, productid) {
            this.remove.cid = itemid
            // this.remove.pid = productid
            let cartremoveitem = await Core.post(`/cart/remove`, this.remove)
            if (cartremoveitem.status == 200) {
                await this.getcart();
            }
        },
        async addone(itemid, productid, qty) {
            this.cartstock.qty = 1
            this.cartstock.cid = itemid
            this.cartstock.productid = productid
            this.cartstock.status = "add"
            if (qty < 5) {
                let cartstockqty = await Core.put(`/cart/update`, this.cartstock)
                if (cartstockqty.status == 200) {
                    await this.getcart();
                }
            }
        },
        async removeone(itemid, productid, qty) {
            this.cartstock.qty = 1
            this.cartstock.cid = itemid
            this.cartstock.productid = productid
            this.cartstock.status = "minus"
            if (qty > 0) {
                let cartstockqty = await Core.put(`/cart/update`, this.cartstock)
                if (cartstockqty.status == 200) {
                    await this.getcart();
                }
            }
        },
        async getdeliverycompany() {
            var deliveryraw = await Core.get(`/delivery/`)
            this.companylist = deliveryraw.data
        },
        async toast(a, b) {
            if (a == 400) {
                let toast = this.$toasted.show(b, {
                    type: "error",
                    theme: "toasted-primary",
                    position: "top-right",
                    duration: 5000
                });
            }
            if (a == 200) {
                let toast = this.$toasted.show(b, {
                    type: "success",
                    theme: "toasted-primary",
                    position: "top-right",
                    duration: 5000
                });
            }
        }
    }
}
</script>

<style>

</style>
