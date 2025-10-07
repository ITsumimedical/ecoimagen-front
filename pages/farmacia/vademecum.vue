<template>
  <div>
    <v-card>
      <v-alert color="info" text class="text-center"><b>VADEMECUM</b></v-alert>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field label="Buscar" v-model="buscar"></v-text-field>
          </v-col>
          <v-col cols="12" sm="1" md="1">
            <v-btn color="success" small dark class="mt-5" @click="listarVademecum();">Filtrar</v-btn>
          </v-col>
          <v-col cols="12" sm="1" md="1">
            <v-btn color="warning" small dark class="mt-5" @click="buscar=null;listarVademecum();">Limpiar</v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-data-table :headers="headers" :items="listaMedicamentos" class="elevation-1" :loading="loadingTable"
        loading-text="Cargando... por favor espere" hide-default-footer>
      </v-data-table>

      <v-col>
        <v-row no-gutters style="background-color: white">
          <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
            <v-pagination v-model="page" class="my-4" :length="totalPages" :total-visible="9"
              @input="listarVademecum()">
            </v-pagination>
          </v-col>
          <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
            <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
              @change="listarVademecum()">
            </v-select>
          </v-col>
        </v-row>
      </v-col>
    </v-card>

    <v-dialog v-model="dialogLote" width="900">
      <v-card class="pt-1">
        <v-card-text>
          <v-alert dense text border="left" icon="mdi-package-variant" class="mt-5 font-weight-bold" color="primary">
            LOTES
          </v-alert>
          <v-row>
            <v-col cols="12">
              <v-list>
                <template v-if="lotes && lotes.length > 0">
                  <v-list-item-group>
                    <v-list-item v-for="(item, index) in lotes" :key="index"
                      class="d-flex justify-space-between align-center">
                      <v-list-item-content>
                        <v-list-item-title>
                          <b>Bodega:</b> {{ item?.bodega?.nombre ?? "Sin Bodega" }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          <template v-if="item?.lotes && item.lotes.length > 0">
                            <v-list dense>
                              <v-list-item v-for="(lote, loteIndex) in item.lotes" :key="loteIndex"
                                class="d-flex justify-space-between align-center">
                                <v-list-item-title>
                                  <v-icon left>mdi-barcode</v-icon>
                                  Codigo: {{ lote?.codigo ?? "Sin Código" }}
                                </v-list-item-title>
                                <v-list-item-title>
                                  <v-icon left>mdi-tooltip</v-icon>
                                  Cantidad: {{ lote?.cantidad ?? "Sin Cantidad" }}
                                </v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </template>
                          <template v-else>
                            <v-list-item>
                              <v-list-item-content class="text-center">
                                <v-list-item-title class="font-weight-bold">
                                  No hay lotes disponibles
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                          </template>
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </template>
                <template v-else>
                  <v-list-item>
                    <v-list-item-content class="text-center">
                      <v-list-item-title class="font-weight-bold">
                        No hay lotes disponibles
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" dark @click="dialogLote = false"> Cerrar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import { listarVademecum } from "~/api/medicamentos/medicamento";

export default {
  middleware({ $can, redirect }) {
    if (!$can("vademecum.vista")) {
      return redirect("/");
    }
  },

  name: "vademecum",

  mounted() {
    this.listarVademecum();
  },

  data() {
    return {
      loadingTable: false,
      page: 1,
      totalPages: 1,
      opcionActual: 5,
      opciones: [5, 10, 20, 50, 100],
      listaMedicamentos: [],
      buscar: "",
      formFiltro: {
        columna: null,
        dato: null,
      },
      lotes: [],
      dialogLote: false,
      headers: [
        {
          text: "CUM",
          align: "center",
          sortable: false,
          value: "cum",
        },
        {
          text: "CODIGO",
          align: "center",
          sortable: false,
          value: "codesumi.codigo",
        },
        {
          text: "PRINCIPIO ACTIVO / FORMA FARMACEUTICA / CONCENTRACION",
          align: "center",
          sortable: false,
          value: "codesumi.nombre",
        },
        {
          text: "Descripcion Comercial",
          align: "center",
          sortable: false,
          value: "invima.producto",
        },
        {
          text: "Unidad Medida",
          align: "center",
          sortable: false,
          value: "invima.unidad_medida",
        },
        {
          text: "Registro Sanitario",
          align: "center",
          sortable: false,
          value: "invima.registro_sanitario",
        },
        {
          text: "Descripción",
          align: "center",
          sortable: false,
          value: "invima.descripcion_comercial",
        },
        {
          text: "Titular",
          align: "center",
          sortable: false,
          value: "invima.titular",
        },
        {
          text: "ATC",
          align: "center",
          sortable: false,
          value: "invima.atc",
        },
      ],

      filtroColumnas: [
        {
          valor: "expediente",
          nombre: "Expediente",
        },
        {
          valor: "producto",
          nombre: "Producto",
        },
        {
          valor: "titular",
          nombre: "Titular",
        },
        {
          valor: "registro_sanitario",
          nombre: "Registro Sanitario",
        },
        {
          valor: "fecha_expedicion",
          nombre: "Fecha Expedicion",
        },
        {
          valor: "fecha_vencimiento",
          nombre: "Fecha Vencimiento",
        },
        {
          valor: "estado_registro",
          nombre: "Estado Registro",
        },
        {
          valor: "expediente_cum",
          nombre: "Expediente CUM",
        },
        {
          valor: "consecutivo_cum",
          nombre: "Consecutivo CUM",
        },
        {
          valor: "cantidad_cum",
          nombre: "Cantidad CUM",
        },
        {
          valor: "descripcion_comercial",
          nombre: "Descripcion Comercial",
        },
        {
          valor: "estado_cum",
          nombre: "Estado CUM",
        },
        {
          valor: "fecha_activo",
          nombre: "Fecha Activo",
        },
        {
          valor: "fecha_inactivo",
          nombre: "Fecha Inactivo",
        },
        {
          valor: "muestra_medica",
          nombre: "Muestra Medica",
        },
        {
          valor: "unidad",
          nombre: "Unidad",
        },
        {
          valor: "atc",
          nombre: "ATC",
        },
        {
          valor: "descripcion_atc",
          nombre: "Descripcion ATC",
        },
        {
          valor: "via_administracion",
          nombre: "Via Administracion",
        },
        {
          valor: "concentracion",
          nombre: "Concentracion",
        },
        {
          valor: "principio_activo",
          nombre: "Principio Activo",
        },
        {
          valor: "unidad_medida",
          nombre: "Unidad Medida",
        },
        {
          valor: "cantidad",
          nombre: "Cantidad",
        },
        {
          valor: "unidad_referencia",
          nombre: "Unidad Referencia",
        },
        {
          valor: "forma_farmaceutica",
          nombre: "Forma Farmaceutica",
        },
        {
          valor: "nombre_rol",
          nombre: "Nombre Rol",
        },
        {
          valor: "tipo_rol",
          nombre: "Tipo Rol",
        },
        {
          valor: "modalidad",
          nombre: "Modalidad",
        },
        {
          valor: "cum_validacion",
          nombre: "CUM Validacion",
        },
      ],
      pagina: 1,
    };
  },

  methods: {
    listarVademecum() {
      this.loadingTable = true;
      this.$axios
        .get(
          "/medicamentos/listarCodigosHorusPaciente?page=" +
          this.page +
          "&cant=" +
          this.opcionActual+
          "&filtro=" +this.buscar,
          this.filtro
        )
        .then((res) => {
          this.listaMedicamentos = res.data.data;
          this.totalPages = res.data.last_page;
          this.loadingTable = false;
        })
        .catch((e) => {
          console.error(e);
          this.loadingTable = false;
        });
    },

    verLote(item) {
      this.dialogLote = true;
      this.lotes = item.bodega_medicamentos;
    },
    limpiar() {
      this.formFiltro = {
        columna: null,
        dato: null,
      };
      this.opcionActual = 5;
      this.listarVademecum();
    },
  },
};
</script>
