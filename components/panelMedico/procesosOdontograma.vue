<template>
    <div>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ modoEdicion ? 'Editar'  : 'Nuevo Proceso'}}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <!-- <v-col cols="12" sm="6" md="6">
                  <v-select v-model="formProceso.tipo" label="Tipo" :items="['Diagnostico','Procedimiento']"></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field v-model="formProceso.categoria" label="Categoria"></v-text-field>
                </v-col> -->
                <v-col cols="12" sm="6" md="6">
                  <v-select v-model="formProceso.identificador" :items="['Solo Color','Caracter']" label="Identificador">
                  </v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6" v-if="formProceso.identificador === 'Caracter'">
                  <v-text-field v-model="formProceso.caracter" label="Simbolo"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select v-model="formProceso.posicion" :items="['Seccion Diente','Diente','Fuera']" label="Posicion">
                  </v-select>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                  <v-text-field v-model="formProceso.descripcion" label="Descripcion"></v-text-field>
              </v-col>
              <v-col cols="12">
                  <v-select label="Clasificacion COP-CEO" :items="clasificacionCOPCEO" v-model="formProceso.clasificacion_cop_ceo"></v-select>
              </v-col>
              <v-col cols="12">
                  <v-select label="Clasificación informe-202" :items="informe202" v-model="formProceso.informe_202"></v-select>
              </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-color-picker v-model="colorSeleccionado" class="ma-2" hide-inputs></v-color-picker>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" dark @click="limpiar()">Cerrar</v-btn>
            <v-btn color="success" dark @click="modoEdicion ? actualizar(formProceso.id) : Guardar()">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-data-table dense :headers="headers" :search="buscar" :items="procesos" no-data-text="Sin datos para mostrar"
        class="elevation-1" :loading="loading" loading-text="Cargando...">
        <template v-slot:top>
          <v-card-title>
            <v-btn small color="boton" class="mb-2 white--text" @click="abrirDialogoNuevo()">
              Nuevo
              <v-icon>
                mdi-plus-circle-outline
              </v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field v-model="buscar" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
            </v-text-field>
          </v-card-title>
        </template>

        <template v-slot:[`item.color`]="{ item }">
          <div :style="'background:'+item.color+';width: 24px;height: 24px;'"></div>
        </template>
        <template v-slot:[`item.estado`]="{ item }">
          <v-chip small :color="getColor(item.estado)" dark> {{ item.estado == true?'Activo':'Inactivo' }} </v-chip>
        </template>
        <template v-slot:[`item.clasificacion_cop_ceo`]="{ item }">
          <v-chip small :color="item.clasificacion_cop_ceo ? 'primary' : 'grey'" dark label> {{ item.clasificacion_cop_ceo || 'Sin clasificación registrada'}} </v-chip>
        </template>
        <template v-slot:[`item.informe_202`]="{ item }">
          <v-chip small :color="item.informe_202 ? 'primary' : 'grey'" dark label> {{ item.informe_202 || 'Sin clasificación registrada'}} </v-chip>
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon :color="item.estado ? 'success' : 'error'" v-bind="attrs" v-on="on" @click="cambiarEstado(item)">
                {{item.estado? "mdi-toggle-switch-off": "mdi-toggle-switch"}}
              </v-icon>
            </template>
            <span>{{item.estado? 'Activo':'Inactivo'}}</span>
          </v-tooltip>
            <template v-if="item.estado === true ">
              <v-icon color="warning" @click="dialogEditar(item)">
                  mdi-pencil
              </v-icon>
            </template>
        </template>
      </v-data-table>
    </div>
  </template>
  <script>
    export default {
      name: 'procesosOdontograma',
      data() {
        return {
          colorSeleccionado: null,
          modoEdicion: false,
          formProceso: {
            tipo: null,
            categoria: null,
            color: null,
            identificador: null,
            caracter: null,
            posicion: null,
            clasificacion_cop_ceo: null,
            informe_202: null,
          },
          loading: false,
          dialog: false,
          buscar: '',
          procesos: [],
          informe202: [
              'SANO',
              'CARIES NO CAVITACIONAL',
              'CARIES CAVITACIONAL',
              'OBTURADO POR CARIES',
              'PERDIDO POR CARIES'
          ],
          clasificacionCOPCEO: [{
              text: 'C - Cariados',
              value: 'C'
            },
            {
              text: 'O - Obturados',
              value: 'O'
            },
            {
              text: 'P - Perdidos',
              value: 'P'
            },
            {
              text: 'E - Extraidos',
              value: 'E'
            }
          ],
          headers: [{
              text: '#',
              value: 'id'
            },
            {
              text: 'Descripcion',
              value: 'descripcion'
            },
            {
              text: 'Color',
              value: 'color'
            },
            {
              text: 'Identificador',
              value: 'identificador'
            },
            {
              text: 'Posicion',
              value: 'posicion'
            },
            {
              text: 'Clasificacion COP-CEO',
              value: 'clasificacion_cop_ceo',
              align: 'center',
            },
            {
              text: 'Clasificacion Informe 202',
              value: 'informe_202',
              align: 'center'
            },
            {
              text: 'Simbolo',
              value: 'caracter'
            },
            {
              text: 'Estado',
              value: 'estado'
            },
            {
              text: 'Acciones',
              value: 'acciones'
            },
          ]
        }
      },
      methods: {
        listar() {
          this.loading = true;
          this.$axios.get('odontograma/listar-parametros').then(res => {
            this.procesos = res.data
          }).catch(e => {
            this.$toast.error(e.response.mensaje);
            console.log(e.response)
          }).finally(() => this.loading = false)
        },
        Guardar() {
          this.formProceso.color = this.colorSeleccionado['hex'];
          this.$axios.post('odontograma/guardar-parametrizacion', this.formProceso).then(res => {
            this.$toast.success(res.mensaje);
            console.log(res);
          }).catch(e => {
            this.$toast.error(e.response.mensaje);
            console.log(e.response)
          }).finally(() => this.limpiar())
        },
        limpiar() {
          for (const campo in this.formProceso) {
            this.formProceso[campo] = null;
          }
          this.colorSeleccionado = null;
          this.dialog = false;
          this.loading = false;
          this.listar();
        },
        getColor(estado) {
          if (estado == 1) return 'green'
          else return 'red'
        },

        dialogEditar(item) {
          this.modoEdicion = true;
          this.dialog = true;
          this.formProceso = {...item}
        },

        actualizar(item) {
              const data = { ...this.formProceso };
              delete data.id;
              this.$axios.put('odontograma/actualizar-parametrizacion/' + item, data).then(res => {
                  this.$toast.success('Actualizado correctamente');
                  this.dialog = false;
                  this.listar();
              }).catch(e => {
                  this.$toast.error('Error al actualizar');
              })
      },
        cambiarEstado(item) {
          this.$swal({
            title: "Está seguro?",
            text: "Desea cambiar el estado",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#d33",
            confirmButtonText: "Aceptar",
          }).then((result) => {
            if (result.value) {
              this.loading = true;
              this.$axios.post('odontograma/cambiar-estado-parametros/'+item.id).then(res => {
                this.$toast.success(res.data.mensaje);
                this.listar()
              }).catch(e => {
                this.$toast.error(e.response.mensaje);
              }).finally(() => this.loading = false)
            }
          });
        },

        abrirDialogoNuevo() {
          this.modoEdicion = false;
          this.dialog = true;
        }
      },
      mounted() {
        this.listar();
      }
    }

  </script>
