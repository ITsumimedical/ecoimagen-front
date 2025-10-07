<template>
    <v-card>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                    <span class="text-h5">Asociar CUP</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-autocomplete :search-input.sync="buscarSede" v-model="formCup.rep_id" :items="sedes" label="Sede" item-text="nombre" item-value="id" required @input="listarParametrizacionCups()"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-autocomplete :search-input.sync="FiltroCups" v-model="formCup.cup_id" :items="cups" item-value="id" item-text="codigo_nombre" label="CUP"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-autocomplete :search-input.sync="FiltroCupsPropios" v-model="formCup.codigo_propio_id" :items="codigosPropios" item-value="id" item-text="CodigoNombre" label="Codigo Propios"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-autocomplete v-model="formCup.categoria" :items="categorias"
                                                :search-input.sync="filtro"  chips item-value="categoria" item-text="categoria" small-chips label="Categoria" clearable>
                                    <template v-slot:no-data>
                                        <v-btn @click="categorias.push(filtro);formCup.categoria = filtro;filtro=''">
                                            Añadir: {{ filtro }}</v-btn>
                                    </template>
                                </v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="limpiarFormulario()">Cerrar</v-btn>
                    <v-btn color="success" @click="guardarParametrizacion()">Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-data-table :headers="headers" :items="parametrizaciones" :search="search">
            <template v-slot:top>
                <v-card-title>
                    <v-btn small color="boton" class="mb-2 white--text" @click="dialog = true">
                        Nuevo
                        <v-icon>
                            mdi-plus-circle-outline
                        </v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" label="Buscar" append-icon="mdi-magnify" hide-details single-line></v-text-field>
                </v-card-title>
            </template>
<!--            <template v-slot:[`item.sede`]="{ item }">-->
<!--                {{item.sede.codigo_habilitacion}} - {{item.sede.nombre}}-->
<!--            </template>-->
<!--            <template v-slot:[`item.procedimientos`]="{ item }">-->
<!--                <template v-if="item.cup_id">-->
<!--                    {{item.cup.codigo}} - {{item.cup.nombre}}-->
<!--                </template>-->
<!--                <template v-else>-->
<!--                    {{item.codigo_propio.codigo}} - {{item.codigo_propio.nombre}}-->
<!--                </template>-->

<!--            </template>-->
            <template v-slot:[`item.eliminar`]="{ item }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-on="on" color="red" icon @click="eliminarParametrizacion(item.id)"><v-icon>mdi-close</v-icon></v-btn>
                    </template>
                    <span>Eliminar</span>
                </v-tooltip>
            </template>
        </v-data-table>
    </v-card>
</template>
<script>
import {mapActions} from "vuex";

export default {
    name: 'parametrizacionCupPrestadores',
    data() {
        return {
            buscarSede:'',
            FiltroCups:'',
            FiltroCupsPropios:'',
            parametrizaciones:[],
            codigosPropios:[],
            cups:[],
            sedes:[],
            filtro:'',
            formCup:{
                rep_id:null,
                cup_id:null,
                codigo_propio_id:null,
                categoria:null
            },
            search:'',
            dialog:false,
            headers:[
                {text:'Sede',align:"left",value:'sede'},
                {text:'Procedimiento',align:"left",value:'procedimientos'},
                {text:'Categoria',align:"left",value:'categoria'},
                {text:'',align:"center",value:'eliminar'},
            ],
            categorias: [],
        }
    },
    watch: {
        buscarSede(val) {
            if (val) {
                if (val.length === 6) {
                    this.listarSedes();
                } else if (val.length < 6) {
                    this.sedes = [];
                }
            } else {
                this.sedes = [];

            }
        },
        FiltroCups(val) {
            if (val) {
                if (val.length === 6) {
                    this.listaCups();
                } else if (val.length < 6) {
                    this.cups = null;
                }
            } else {
                this.cups = null;

            }
        },

        FiltroCupsPropios(val) {
            if (val) {
                if (val.length === 6) {
                    this.listarCodigosPropios();
                } else if (val.length < 6) {
                    this.codigosPropios = null;
                }
            } else {
                this.codigosPropios = null;

            }
        },
    },
    mounted() {
        this.listarCupsPrestadores();
    },
    methods:{
        ...mapActions('app', ['setPreload']),
        limpiarFormulario(){
            for (const filtro in this.formCup){
                this.formCup[filtro]=null;
            }
            this.dialog = false;
        },
        listarCupsPrestadores(){
            this.setPreload(true);
            this.$axios.get("reps/cups-prestador").then(response => {
                this.parametrizaciones = response.data.map(s => {
					let data = s;
					data.sede = s.sede.codigo_habilitacion+' - '+s.sede.nombre
					data.procedimientos = (s.cup_id?(s.cup.codigo+' - '+s.cup.nombre):(s.codigo_propio.codigo+' - '+s.codigo_propio.nombre))
					return data;
				});
            }).catch(e => console.log(e.response)).finally( () => {this.setPreload(false)})
        },
        listarSedes() {
            this.setPreload(true);
            this.$axios
                .post("reps/listarConfiltro", {
                    rep: this.buscarSede,
                })
                .then((res) => {
                    this.sedes = res.data;
                }).catch(e => console.log(e.response)).finally( () => this.setPreload(false))
        },
        listarCups() {
            this.setPreload(true);
            this.$axios.post('/cup/listar').then(res => {
                this.cups = res.data.data;
            }).catch(e => console.log(e.response)).finally( () => {this.setPreload(false)})
        },
        guardarParametrizacion(){
            if(!this.formCup.rep_id){
                return this.$toast.error('El campo "sede" es requerido.');
            }
            if(!this.formCup.cup_id && !this.formCup.codigo_propio_id){
                return this.$toast.error('El procedimiento es requerido.');
            }
            if(!this.formCup.categoria){
                return this.$toast.error('El campo "categoria" es requerido.');
            }
            this.setPreload(true);
            this.$axios.post('reps/guardar-parametrizacion-cup',this.formCup).then(res => {
                this.$toast.success(res.data.mensaje);
                this.limpiarFormulario();
                this.listarCupsPrestadores();
            }).catch(e => console.log(e.response)).finally( () => {this.setPreload(false)})
        },
        eliminarParametrizacion(id){
			this.setPreload(true);
            this.$axios.delete(`reps/eliminar-parametrizacion/${id}`).then(response => {
                this.$toast.success(response.data.mensaje);
                this.limpiarFormulario();
                this.listarCupsPrestadores();
            }).catch(e => console.log(e.response)).finally( () => {this.setPreload(false)})
        },
        listarParametrizacionCups(){
            this.setPreload(true);
            this.$axios.get('reps/parametrizacion-categoria-sede/'+this.formCup.rep_id).then(response => {
                this.categorias = response.data;
            }).catch(e => console.log(e.response)).finally( () => this.setPreload(false))
        },
        listaCups() {
            this.setPreload(true);
            this.$axios.get('/cup/BuscarCup/'+this.FiltroCups).then(res => {
                this.cups = res.data.original
            }).catch(e => console.log(e.response)).finally( () => this.setPreload(false))
        },
        listarCodigosPropios(){
            this.setPreload(true);
            this.$axios.get('/codigo-propio/BuscarCodigoPropio/'+this.FiltroCupsPropios).then(res => {
                this.codigosPropios = res.data.original
            }).catch(e => console.log(e.response)).finally( () => this.setPreload(false))
        }
    }
}
</script>
