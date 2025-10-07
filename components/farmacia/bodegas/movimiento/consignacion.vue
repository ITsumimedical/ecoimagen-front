<template>
    <div>
        <v-dialog v-model="dialogCargaMasiva" width="500">
            <v-form ref="formCarga" v-model="valid" lazy-validation>
            <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                    Carga Masiva Ingreso Consignacion
                </v-card-title>
                <v-card-text>
                    <v-file-input show-size counter label="Cargar Plantilla" v-model="fileCarga" required :rules="[v => !!v || 'El campo es requerido']"></v-file-input>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="error" @click="dialogCargaMasiva = false">Cerrar</v-btn>
                    <v-btn small color="success" @click="leerExcel()">Validar</v-btn>
                </v-card-actions>
            </v-card>
            </v-form>
        </v-dialog>
        <v-dialog v-model="dialogError" width="500">
            <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                    Errores Carga Masiva
                </v-card-title>
                <v-card-text>
                    <template v-for="error in errorCarga">
                        <v-alert border="right" colored-border type="error" elevation="2">Error en la fila <strong>{{error.columna}}</strong>, {{error.mensaje}} </v-alert>
                    </template>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" small @click="dialogError = false">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-card>
            <v-container>
                <v-row>
                    <v-col cols="12" md="8">
                        <v-autocomplete v-model="formConsignacion.bodega_origen_id"
                                        label="Bodega Solicitante*" :items="listaBodegas" item-text="nombre"
                                        item-value="id"
                                        @change="listarMedicamentosBodega()"
                                        required></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-autocomplete v-model="formConsignacion.proveedor_id" :items="proveedores" item-value="id"
                                        item-text="nombre" label="Proveedor"></v-autocomplete>
                    </v-col>

                </v-row>
                <v-form ref="form" v-model="valid" lazy-validation
                        v-if="formConsignacion.proveedor_id && formConsignacion.bodega_origen_id">
                    <v-row justify="end">
                        <v-col cols="12" md="12">
                            <v-divider></v-divider>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-autocomplete v-model="formDetalleConsignacion.articulo" :loading="preloadArticulos"
                                            label="Articulo*" :items="listaMedicamentos"
                                            :item-text="listaMedicamentos => listaMedicamentos.invima?listaMedicamentos.codesumi.codigo+' (' + listaMedicamentos.codesumi.nombre+' - '+listaMedicamentos.invima.titular+' - '+listaMedicamentos.invima.expediente+')':listaMedicamentos.codesumi.codigo+' (' + listaMedicamentos.codesumi.nombre+' - '+')'"
                                            return-object required dense
                                            :rules="[v => !!v || 'Articulo es requerido']"></v-autocomplete>
                        </v-col>

                        <v-col cols="12" md="2">
                            <v-text-field v-model="fecha_vencimiento" type="date"
                                          :rules="[v => !!v || 'Fecha Vencimiento es requerido',
                                          v => v >= this.$moment().add(1,'months').format('YYYY-MM-DD') || 'La Fecha de vencimiento debe ser superior a un mes']"
                                          label="Fecha Vencimiento" dense required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="1">
                            <v-text-field type="number" suffix="°C" v-model="formDetalleConsignacion.temperatura"
                                          label="Temperatura"
                                          dense></v-text-field>
                        </v-col>
                        <v-col cols="12" md="2">
                            <v-text-field v-model="lote" label="Lote" dense
                                          :rules="[v => !!v || 'Lote es requerido']" required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="1">
                            <v-text-field type="number" v-model="cantidad" label="Cantidad"
                                          :rules="[v => !!v || 'Cantidad es requerido',
                                          v => v >= 0 || 'La cantidad debe tener un valor mayor a 0']" dense
                                          required></v-text-field>
                        </v-col>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn small color="primary" @click="agregarArticulo()">Agregar</v-btn>
                            <v-btn small color="success" @click="dialogCargaMasiva = true">Cargar Masiva</v-btn>
                        </v-card-actions>
                    </v-row>
                </v-form>
                <v-row v-if="formConsignacion.proveedor_id && formConsignacion.bodega_origen_id">
                    <v-col cols="12" md="12">
                        <v-data-table :headers="headers" :items="articulosSeleccionado" hide-default-footer
                                      disable-pagination>
                            <template v-slot:top>
                                <v-col cols="12" md="3">
                                    <v-text-field outlined dense label="OX" v-model="formConsignacion.ordenDespacho"></v-text-field>
                                </v-col>
                            </template>
                            <template v-slot:item.temperatura="{ item }">
                                {{ item.temperatura }} °C
                            </template>
                            <template v-slot:item.lote="{ item,index }">
                                <v-edit-dialog cancel-text="Cancelar">
                                    <v-badge bordered color="error" overlap :content="String(item.lotes.length)">
                                        <v-btn icon color="blue">
                                            <v-icon>mdi-archive-alert</v-icon>
                                        </v-btn>
                                    </v-badge>
                                    <template v-slot:input>
                                        <v-container>
                                            <v-form ref="form2" v-model="valid" lazy-validation>
                                                <v-row>
                                                    <v-col cols="12" md="4">
                                                        <v-text-field dense label="# Lote" v-model="formLote.nombre"
                                                                      :rules="[v => !!v || 'Lote es requerido']"
                                                                      required></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" md="4">
                                                        <v-text-field type="number" dense label="Cantidad"
                                                                      v-model="formLote.cantidad" :rules="[v => !!v || 'Cantidad es requerido',
                                          v => v >= 0 || 'La cantidad debe tener un valor mayor a 0']"
                                                                      required></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" md="4">
                                                    <v-text-field v-model="formLote.fecha_vencimiento" type="date"
                                                                  :rules="[v => !!v || 'Fecha Vencimiento es requerido',
                                                                  v => v >= $moment().add(1,'months').format('YYYY-MM-DD') || 'La Fecha de vencimiento debe ser superior a un mes']"
                                                                  label="Fecha Vencimiento" dense required></v-text-field>
                                                    </v-col>
                                                    <v-btn dense small block color="success"
                                                           @click="agregarLote(index)">Agregar
                                                    </v-btn>
                                                </v-row>
                                            </v-form>
                                            <v-row>
                                                <v-col cols="12" md="12">
                                                    <v-simple-table dense>
                                                        <template v-slot:default>
                                                            <thead>
                                                            <tr>
                                                                <th class="text-left"># Lote</th>
                                                                <th class="text-left">Fecha Vencimiento</th>
                                                                <th class="text-right">Cantidad</th>
                                                                <th class="text-center"></th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            <tr v-for="(lote,index2) in item.lotes" :key="index2">
                                                                <td class="text-left">{{ lote.nombre }}</td>
                                                                <td class="text-left">{{ lote.fecha_vencimiento }}</td>
                                                                <td class="text-right">{{ lote.cantidad }}</td>
                                                                <td class="text-center">
                                                                    <v-btn small icon color="red"
                                                                           @click="articulosSeleccionado[index].lotes.splice(index2,1)">
                                                                        <v-icon>mdi-delete</v-icon>
                                                                    </v-btn>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </template>
                                                    </v-simple-table>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </template>
                                </v-edit-dialog>
                            </template>
                            <template v-slot:item.cantidad="{ item,index }">
                               <strong>{{ item.lotes.reduce((acumulador, actual) => acumulador + parseInt(actual.cantidad), 0) }}</strong>
                            </template>
                            <template v-slot:item.acciones="{ item,index }">
                                <v-btn icon color="red" @click="articulosSeleccionado.splice(index,1)">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </template>
                        </v-data-table>
                    </v-col>
                    <v-col cols="12" md="12">
                        <v-btn block color="success" v-if="articulosSeleccionado.length > 0" @click="GuardarSolicitud">Guardar</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </div>
</template>
<script>

import {mapActions} from "vuex";
import { leerExcel, crearExcel } from '@/utils/excel';

export default {
    name: "IngresoConsignacion",
    data() {
        return {
            fileCarga:null,
            valid: true,
            dialogCargaMasiva: false,
            articulosSeleccionado: [],
            listaMedicamentos: [],
            preloadArticulos: false,
            listaBodegas: [],
            proveedores: [],
            cantidad: null,
            lote: null,
            fecha_vencimiento: null,
            formLote: {
                nombre: null,
                cantidad: null,
                fecha_vencimiento: null,
            },
            formDetalleConsignacion: {
                articulo: null,
                lotes: [],
                temperatura: null,
            },
            formDetalleConsignacionCarga: {
                articulo: null,
                lotes: [],
                temperatura: null,
            },
            formConsignacion: {
                bodega_origen_id: null,
                proveedor_id: null,
                ordenDespacho: null,
            },
            headers: [
                {text: 'Articulo', value: 'articulo.nombre_completo', align: 'left'},
                {text: 'Lotes', value: 'lote', align: 'left'},
                {text: 'Cantidad Total', value: 'cantidad', align: 'center'},
                {text: 'Temperatura', value: 'temperatura', align: 'right'},
                {text: '', value: 'acciones', align: 'center'},
            ],
            errorCarga:[],
            dialogError:false,
        }
    },
    mounted() {
        this.listarBodegas();
        this.listarProveedores();
    },
    methods: {
        ...mapActions("app", ["setPreload"]),
        listarBodegas() {
            this.setPreload(true);
            this.$axios.get('bodegas/listar?page=0&filas=0').then(res => {
                this.listaBodegas = res.data
            }).catch(e => {
                console.log(e);
            }).finally(() => this.setPreload(false))
        },
        listarProveedores() {
            this.setPreload(true);
            this.$axios.get('proveedor').then(res => {
                this.proveedores = res.data
            }).catch(e => {
                console.log(e);
            }).finally(() => this.setPreload(false))
        },
        listarMedicamentosBodega() {
            this.setPreload(true);
            this.$axios.post('/medicamentos/listarMedicamentoBodega', {bodega:this.formConsignacion.bodega_origen_id}).then(res => {
                this.listaMedicamentos = res.data;
            }).catch(e => {
                console.log(e.response);
            }).finally(() => this.setPreload(false))
        },
        agregarArticulo() {
            console.log(this.$refs.form.validate());
            if (this.$refs.form.validate()) {
                this.formDetalleConsignacion.articulo.nombre_completo = this.formDetalleConsignacion.articulo.invima ? this.formDetalleConsignacion.articulo.codesumi.codigo + ' (' + this.formDetalleConsignacion.articulo.codesumi.nombre + ' - ' + this.formDetalleConsignacion.articulo.invima.titular + ' - ' + this.formDetalleConsignacion.articulo.invima.expediente + ')' : this.formDetalleConsignacion.articulo.codesumi.codigo + ' (' + this.formDetalleConsignacion.articulo.codesumi.nombre + ' - ' + ')';
                this.formDetalleConsignacion.lotes.push({nombre:this.lote,cantidad:this.cantidad,fecha_vencimiento:this.fecha_vencimiento});
                this.articulosSeleccionado.push({...this.formDetalleConsignacion});
                this.limpiarDetalle();
            }
        },
        limpiarDetalle() {
            for (const detalles in this.formDetalleConsignacion) {
                this.formDetalleConsignacion[detalles] = null;
            }
            this.formDetalleConsignacion.lotes = [];
            this.lote = null;
            this.cantidad = null;
            this.$refs.form.reset();
            this.formConsignacion.ordenDespacho = null;
        },
        agregarLote(indice) {
            if (this.$refs.form2.validate()) {
                this.articulosSeleccionado[indice].lotes.push({...this.formLote});
                this.formLote.nombre = null;
                this.formLote.cantidad = null;
            }
            this.$refs.form2.reset();
        },
        GuardarSolicitud(){
            if(!this.formConsignacion.ordenDespacho){
               return this.$toast.error('La orden de despacho (OX) es requerido');
            }
            if(this.articulosSeleccionado.filter(s => s.lotes.length === 0).length > 0){
                return this.$toast.error('Hay articulos seleccionados con lotes en 0');
            }
            this.$swal({
                title: 'Esta Seguro?',
                text: "La siguiente accion movera saldos en el sistema",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Guardar'
            }).then((result) => {
                if (result.value) {
                    this.setPreload(true);
                    let data = this.formConsignacion;
                    data.detalles = this.articulosSeleccionado;
                    this.$axios.post('movimientos/consignacion', data,{responseType: "arraybuffer"}).then(res => {
                        this.$toast.success('Movimiento Generado');
                        let blob = new Blob([res.data], {
                            type: "application/pdf"
                        });
                        let link = document.createElement("a");
                        link.href = window.URL.createObjectURL(blob);
                        window.open(link.href, "_blank");
                        this.articulosSeleccionado = [];
                        this.limpiarDetalle();
                    }).catch(error => {
                        this.preload = false;
                        this.$toast.error(error.response.mensaje);
                    }).finally(() => {this.setPreload(false)})
                }
            })
        },
        agregarArticuloCargaMasiva(articuloCarga){
            const existente = this.articulosSeleccionado.findIndex(s => parseInt(s.articulo.id) === parseInt(articuloCarga.articulo.id));
            if(existente > -1){
                this.articulosSeleccionado[existente].lotes.push(articuloCarga.lotes[0]);
            }else{
                this.articulosSeleccionado.push(articuloCarga);
            }
        },
        async leerExcel(){
            if(this.$refs.formCarga.validate()){
                const excel = await leerExcel(this.fileCarga);
                for (const id in excel){
                    if(id > 0){
                        let dato = {};
                        const articulo = this.listaMedicamentos.find(s => s.cum === excel[id][1])
                        if(articulo){
                            if(!excel[id][3] || !excel[id][4] || !excel[id][5]){
                               this.errorCarga.push({columna:parseInt(id)+1,mensaje:'El articulo tienes datos vacios que son requeridos (lote,cantidad,vencimiento)'})
                            }else{
                                if(!this.$moment(excel[id][5],"YYYY-MM-DD",true).isValid()){
                                   return this.errorCarga.push({columna:parseInt(id)+1,mensaje:'El articulo tiene un fecha de vencimiento invalida'})
                                }
                                dato.articulo = articulo;
                                dato.articulo.nombre_completo = articulo.invima ? articulo.codesumi.codigo + ' (' + articulo.codesumi.nombre + ' - ' + articulo.invima.titular + ' - ' + articulo.invima.expediente + ')' : articulo.codesumi.codigo + ' (' + articulo.codesumi.nombre + ' - ' + ')';
                                dato.lotes = [{nombre:excel[id][4],cantidad:excel[id][3],fecha_vencimiento:excel[id][5]}]
                                dato.temperatura = excel[id][6];
                                this.agregarArticuloCargaMasiva(dato);
                            }
                        }else{
                            this.errorCarga.push({columna:parseInt(id)+1,mensaje:'El articulo no registra en la base de datos'})
                        }
                    }
                }
                this.dialogCargaMasiva = false;
                this.fileCarga = null;
                if(this.errorCarga.length > 0){
                    this.dialogError = true;
                }
            }
        }
    }
}
</script>
