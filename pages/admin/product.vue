<template>
<v-app class="mt-5 ml-5 mr-5">
    <div class="mt-2">
        <v-card>
            <v-card-text>
                <v-data-table :headers="headers" :items="productlist" :items-per-page="30" sort-by="secretid" class="elevation-1">
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-toolbar-title>สินค้าทั้งหมด</v-toolbar-title>
                            <v-divider class="mx-4" inset vertical></v-divider>
                            <v-spacer></v-spacer>
                            <v-dialog v-model="dialog" max-width="500px">
                                <!-- Edit item and Add item -->
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                        <v-icon class="mr-3">mdi-plus-box</v-icon> เพิ่มสินค้าใหม่
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-card-title>
                                        <span class="text-h5">{{ formTitle }}</span>
                                    </v-card-title>

                                    <v-card-text>
                                        <v-container>
                                            <v-row v-if="editedIndex > -1" class="d-flex justify-center">
                                                <v-col cols="6">
                                                    <v-img :src="editedItem.product_image"></v-img>
                                                </v-col>
                                            </v-row>

                                            <v-row>
                                                <v-col cols="12" sm="3" md="12">
                                                    <!-- <v-text-field v-model="editedItem.image" label="รูป"></v-text-field> -->
                                                    <v-file-input class="mt-2" label="เลือกรูปภาพ" v-model="imgupload" v-on:change="selectFile" required accept="image/*"></v-file-input>
                                                </v-col>
                                                <v-col cols="12" sm="3" md="6">
                                                    <v-text-field v-model="editedItem.product_id" required label="รหัสสินค้า"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-text-field v-model="editedItem.product_name" lrequired abel="ชื่อสินค้า"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-select :items="categorylist" label="หมวดหมู่สินค้า" required full-width v-model="editedItem.category_id" item-value="id" item-text="cname" class="selector"></v-select>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-text-field v-model="editedItem.product_cost" required label="ราคาต้นทุน"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-text-field v-model="editedItem.product_price" required label="ราคาสินค้า"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-text-field v-model="editedItem.product_qty" required label="จำนวนคงเหลือ"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <!-- <v-text-field v-model="editedItem.product_status" label="สถานะสินค้า"></v-text-field> -->
                                                    <!-- <v-select :items="dataitems" v-model="editedItem.product_status" @input="changstatus(item.product_id, item.product_status)" class="selector"></v-select> -->
                                                    <v-select :items="dataitems" label="สถานะสินค้า" required v-model="editedItem.product_status_code" item-value="id" item-text="name" class="selector"></v-select>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-select :items="registeringlist" label="สินค้าลงทะเบียน" required v-model="editedItem.product_registering_code" item-value="id" item-text="name" class="selector"></v-select>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="12">
                                                    <v-text-field v-model="editedItem.product_detail" label="รายละเอียดสินค้า"></v-text-field>
                                                </v-col>

                                                <v-col cols="12" class="d-block">
                                                    <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="date" transition="scale-transition" offset-y min-width="auto">
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <!-- <v-text-field v-model="dateRangeText" :value="editedItem.product_registering_dates" :disabled="editedItem.product_registering_code == 1" label="กรอกเวลา" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field> -->
                                                            <v-text-field v-model="dateRangeText" :disabled="editedItem.product_registering_code == 1" label="กรอกเวลา" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                                                        </template>
                                                        <v-date-picker v-model="dates" range no-title scrollable>
                                                            <v-spacer></v-spacer>
                                                            <v-btn text color="error" @click="menu = false">
                                                                <v-icon>mdi-cancel</v-icon>
                                                            </v-btn>
                                                            <v-btn text color="success" @click="$refs.menu.save(date)">
                                                                <v-icon>mdi-check</v-icon>
                                                            </v-btn>
                                                        </v-date-picker>
                                                    </v-menu>
                                                </v-col>

                                            </v-row>
                                        </v-container>
                                    </v-card-text>

                                    <v-card-actions v-if="editedIndex == -1">
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="close">
                                            ยกเลิก
                                        </v-btn>
                                        <v-btn color="blue darken-1" text @click="newitemupload()">
                                            บันทึก
                                        </v-btn>
                                    </v-card-actions>
                                    <v-card-actions v-if="editedIndex > -1">
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="close">
                                            ยกเลิก
                                        </v-btn>
                                        <v-btn color="blue darken-1" text @click="saveedititem()">
                                            บันทึก
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog><!-- End Edit item -->

                            <v-dialog v-model="dialogDelete" max-width="500px">
                                <v-card>
                                    <v-card-title class="text-h5">ยืนยันการลบสินค้า</v-card-title>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="closeDelete">ยกเลิก</v-btn>
                                        <v-btn color="blue darken-1" text @click="deleteItemConfirm">ยืนยัน</v-btn>
                                        <v-spacer></v-spacer>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-toolbar>
                    </template>

                    <template v-slot:item.image=" {item} ">
                        <v-img :src="`${item.product_image}`" alt="" class="imgsize"></v-img>
                    </template>
                    <template v-slot:item.glutenfree="{ item }">
                        <!-- <v-simple-checkbox v-model="editedItem.product_status" disabled></v-simple-checkbox> -->
                        <v-select :items="dataitems" v-model="item.product_status_code" @input="changstatus(item.product_id, item.product_status_code, item.secretid)" item-value="id" item-text="name" class="selector"></v-select>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-icon class="mr-2" @click="editItem(item)">
                            mdi-pencil
                        </v-icon>
                        <v-icon @click="deleteItem(item)">
                            mdi-delete
                        </v-icon>
                    </template>
                    <template v-slot:no-data>
                        <div>
                            nodata
                        </div>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </div>
    <!-- <div>
        <pre>
        {{editedItem}}

        {{productlist}}
        </pre>
    </div> -->
</v-app>
</template>

<script>
import { Core } from '@/vuexes/core'
export default {
    layout: 'admin',
    data: () => ({
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        menu: false,
        dates: [],
        imgupload: {},
        dialog: false,
        dialogDelete: false,
        dataitems: [
            { id: 1, name: 'จำหน่าย' },
            { id: 2, name: 'งดจำหน่าย' },
        ],
        registeringlist: [
            { id: 1, name: 'ไม่ลงทะเบียน' },
            { id: 2, name: 'ลงทะเบียน' },
        ],
        headers: [
            { text: 'รหัสสินค้า', sortable: true, value: 'product_id' },
            { text: 'รูปภาพ', sortable: false, value: 'image' },
            { text: 'ชื่อสินค้า', sortable: false, value: 'product_name' },
            { text: 'ราคาสินค้า', value: 'product_price' },
            { text: 'จำนวนคงเหลือ', value: 'product_qty' },
            { text: 'จำหน่ายแล้ว', value: 'sold_qty' },
            { text: 'สถานะวางขาย', value: 'glutenfree', sortable: false },
            { text: 'Actions', value: 'actions', sortable: false },
            // { text: 'glutenfree', value: 'glutenfree', sortable: false },
        ],
        categorylist: [],
        productlist: [],
        desserts: [],
        editedIndex: -1,
        editedItem: {},
        defaultItem: {},
        productstatus: {
            id: {},
            status: {},
            type: {},
        },
        defaultproductstatus: {
            id: {},
            status: {},
            type: {},
        },
        filedata: null,

    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'เพิ่มสินค้าใหม่' : 'แก้ไขสินค้า'
        },
        dateRangeText() {
            // return this.editedItem.product_registering_dates.join(' ถึง ')
            return this.dates.join(' ถึง ')
        },
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },

    async created() {
        this.getproduct()
        this.getcategory()
    },

    methods: {
        test(item) {
            console.log(item)
        },
        async changstatus(itemid, itemstatus, a) {
            this.productstatus.type = "updatestatus"
            this.productstatus.id = itemid
            this.productstatus.status = itemstatus
            this.productstatus.secretid = a
            let updatestatus = await Core.post(`/admin/product/edit`, this.productstatus)
            if (updatestatus) {
                this.toast(updatestatus.status, updatestatus.message)
            }
            this.$nextTick(() => {
                this.productstatus = Object.assign({}, this.defaultproductstatus)
            })
        },

        async saveedititem() {
            this.editedItem.type = 'updateproduct'
            let formData = new FormData();
            formData.append('image', this.filedata);
            formData.append('product_id', this.editedItem.product_id);
            formData.append('product_name', this.editedItem.product_name);
            formData.append('product_cost', this.editedItem.product_cost);
            formData.append('product_price', this.editedItem.product_price);
            formData.append('product_qty', this.editedItem.product_qty);
            formData.append('product_status', this.editedItem.product_status_code);
            formData.append('product_category', this.editedItem.category_id);
            formData.append('product_detail', this.editedItem.product_detail);
            formData.append('product_registering_code', this.editedItem.product_registering_code);
            formData.append('secretid', this.editedItem.secretid);
            formData.append('category_id', this.editedItem.category_id);
            formData.append('type', 'updateproduct');
            formData.append('product_registering_date', this.dates);
            let edititemraw = await Core.post('/admin/product/edit', formData)
            if (edititemraw) {
                this.toast(edititemraw.status, edititemraw.message)
            }
            if (edititemraw.status == 200) {
                this.getproduct()
                this.close();
            }
        },

        editItem(item) {
            this.editedIndex = this.productlist.indexOf(item)
            this.editedItem = Object.assign({}, item)
            // this.dates = this.editedItem.product_registering_date
            let appdates = []
            if(this.editedItem.product_registering_dates_max || this.editedItem.product_registering_dates_min){
                var datemin = this.editedItem.product_registering_dates_min
                var dateminsplit = datemin.split('T')
                var datecutmin = dateminsplit[0]

                var datemax = this.editedItem.product_registering_dates_max
                var datemaxsplit = datemax.split('T')
                var datecutmax = datemaxsplit[0]

                appdates.push(datecutmin)
                appdates.push(datecutmax)
            }
            this.dates = appdates
            this.dialog = true
        },

        deleteItem(item) {
            this.editedIndex = this.productlist.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        async deleteItemConfirm() {
            // this.productlist.splice(this.editedIndex, 1)
            let delitem = await Core.post(`/admin/product/del`, this.editedItem)
            if (delitem.status == 200) {
                this.toast(delitem.status, delitem.message)
                this.getproduct()
                this.closeDelete()
            }
            if (delitem.status == 400) {
                this.toast(delitem.status, delitem.message)
                this.closeDelete()
            }
        },

        close() {
            this.dialog = false

            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
                this.imgupload = null
                this.dates = []
            })
        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.productlist[this.editedIndex], this.editedItem)
            } else {
                this.productlist.push(this.editedItem)
            }
            this.close()
        },

        async getproduct() {
             var productraw = await Core.get(`/admin/product`)
             this.productlist = productraw
        },
        async getcategory() {
            this.categorylist = await Core.get(`/category`)
        },

        async selectFile(event) {
            this.filedata = event
        },
        async newitemupload(item) {
            let formData = new FormData();
            formData.append('image', this.filedata);
            formData.append('product_id', this.editedItem.product_id);
            formData.append('product_name', this.editedItem.product_name);
            formData.append('product_cost', this.editedItem.product_cost);
            formData.append('product_price', this.editedItem.product_price);
            formData.append('product_qty', this.editedItem.product_qty);
            formData.append('product_status', this.editedItem.product_status_code);
            formData.append('product_category', this.editedItem.category_id);
            formData.append('product_detail', this.editedItem.product_detail);
            formData.append('product_registering_code', this.editedItem.product_registering_code);
            let addproduct = await Core.post(`/admin/product/new`, formData)
            if (addproduct.status == 200) {
                this.toast(addproduct.status, addproduct.message)
                this.close()
                this.getproduct()
            }
            // if (uploaddata.status == 200) {
            //     this.filedata = this.defaultfile
            //     this.formpayment = this.formpaymentdefault
            //     this.imagefile = null
            //     this.dialogpayment = false
            //     this.toast(uploaddata.status, uploaddata.message)
            //     this.getreceipt()
            // }
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

    },
}
</script>

<style>
.selector {
    max-width: 100px;
}

.imgsize {
    max-width: 50px;
}
</style>
