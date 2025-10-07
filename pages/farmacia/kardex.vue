<template>
  <div>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <v-card>

          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="Número factura" prepend-icon="mdi-barcode" dense v-model="filtro.factura">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6"></v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field label="Desde" type="date" color="primary" dense v-model="filtro.fechaDesde">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field label="Hasta" type="date" color="primary" dense v-model="filtro.fechaHasta">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete label="Bodega" v-model="filtro.bodega_id" :items="listaBodegas" item-text="nombre"
                  item-value="id">
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete v-model="filtro.codigo" :items="listaCodeSumi" item-text="nombre" item-value="codigo"
                  :search-input.sync="listarMedicamentos" no-data-text="Debe ingresar el nombre del medicamento"
                  label="Digita el nombre de medicamento" :loading="cargandoMolecula">
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" small :loading="cargando" :disabled="cargando" @click="consultar()">
              Consultar
            </v-btn>
            <v-btn color="error" small :loading="cargando" :disabled="cargando" @click="limpiar()">
              Limpiar
            </v-btn>
          </v-card-actions>

          <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details>
            </v-text-field>
          </v-card-title>

          <v-data-table :headers="headers" :loading="cargando" :items="listKardex" :search="search">
            <template v-slot:[`item.codigo_factura`]="{ item }">
              {{ item.codigo_factura?item.codigo_factura:'Sin Factura' }}
            </template>
            <template v-slot:[`item.orden_id`]="{ item }">
              {{ item.orden_id?item.orden_id:'No Es Dispensación' }}
            </template>
            <template v-slot:[`item.cantidad_anterior`]="{ item }">
              {{ Number(item.cantidad_anterior) }}
            </template>
            <template v-slot:[`item.bodega_destino`]="{ item }">
              {{ item.bodega_destino?item.bodega_destino:'No Es Traslado' }}
            </template>
          </v-data-table>

        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    name: 'WorkspaceJsonKardex',

    data() {
      return {
        dialogo: false,
        search: '',
        filtro: {
          factura: '',
          fechaDesde: '',
          fechaHasta: '',
          bodega_id: '',
          codigo: ''
        },
        cargandoMolecula: false,
        cargando: false,
        listaBodegas: [],
        listaCodeSumi: [],
        title: '',
        listarMedicamentos:null,
        listKardex: [],
        headers: [
          {
            text: 'id solicitud',
            value: 'solicitud_bodega_id',
            sortable: true
          },
          {
            text: 'Tipo Transación',
            value: 'transaccion',
            sortable: true
          },
          {
            text: 'Número Factura',
            value: 'codigo_factura',
            sortable: true
          },
          {
            text: 'Número Orden',
            value: 'orden_id',
            sortable: true
          },
          {
            text: 'F_Movimineto',
            value: 'creacion_movimiento',
            sortable: true
          },
          {
            text: 'Total Inicial',
            value: 'cantidad_anterior',
            sortable: false
          },
          {
            text: 'Cantidad Transacción',
            value: 'cantidad_solicitada',
            sortable: false
          },
          {
            text: 'Total Final',
            value: 'cantidad_final',
            sortable: false
          },
          {
            text: '# Lote',
            value: 'numero_lote',
            sortable: true
          },
          {
            text: 'Medicamento',
            value: 'medicamento',
            sortable: true
          },
          {
            text: 'Usuario',
            value: 'responsable',
            sortable: true
          },
          {
            text: 'Bodega origen',
            value: 'bodega_origen',
            sortable: true
          },
          {
            text: 'Bodega destino',
            value: 'bodega_destino',
            sortable: true
          },
        ],
      };
    },

    mounted() {
      this.listarBodegas();
    },

    watch: {
      listarMedicamentos(val) {
        if (val) {
          if (val.length === 6) {
            this.listarCodesumis();
          } else if (val.length < 6) {
            this.listaCodeSumi = null;
          }
        } else {
          this.listaCodeSumi = null;

        }
      },
    },

    methods: {

      listarBodegas() {
        // this.preload = true;
        this.$axios.get('/bodegas/listarBodegasAsociadas').then(res => {
          this.listaBodegas = res.data;
        }).catch(e => {
          console.log(e.response)
        })
      },

      listarCodesumis() {
        this.cargandoMolecula = true
        this.$axios.post("/bodegas/listarCodigosSumi", this.filtro.codigo).then(res => {
          this.cargandoMolecula = false
          this.listaCodeSumi = res.data.map((codesumi) => {
            return {
              codigo: codesumi.codigo,
              nombre: `${codesumi.codigo} - ${codesumi.nombre}`,
            };
          });
        }).catch(e => {
          this.cargandoMolecula = false
          console.log(e.response)
        })
      },

      consultar() {
        this.cargando = true;
        this.$axios.post('bodegas/kardex', this.filtro).then(res => {
          this.cargando = false;
          this.listKardex = res.data.kardex;
        }).catch(e => {
          this.cargando = false;
          console.log(e);
        })
      },

      limpiar() {
        // this.filtro.factura = '',
        //   this.filtro.fechaDesde = '',
        //   this.filtro.fechaHasta = '',
        //   this.filtro.bodega_id = '',
          this.filtro.codigo = ''
      },

    },
  };

</script>

<style lang="scss" scoped>

</style>
