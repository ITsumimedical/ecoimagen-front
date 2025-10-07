<template>
  <div>
    <!-- Preload de Carga -->
    <v-dialog v-model="preload" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Tranquilo procesamos tu solicitud !
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-row dense class="mt-3">
      <v-col cols="12" sm="12" md="10">
        <v-autocomplete dense return-object label="Buscar Servicios"
          no-data-text="Digite el nombre o código para iniciar la búsqueda" :search-input.sync="campoBusqueda"
          v-model="codigoAgregar.codigoPropio" :items="codigosPropios" item-text="CodigoNombre" :loading="loading"
          :error-messages="errores.codigoPropio" />
      </v-col>
      <v-col cols="12" sm="12" md="2">
        <v-text-field dense v-model="codigoAgregar.cantidad" label="Cantidad" type="number"
          :error-messages="errores.cantidad" />
      </v-col>
      <v-col cols="12" sm="12" md="3">
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y
          min-width="auto">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="codigoAgregar.fechaVigencia" label="Vigencia Desde" prepend-icon="mdi-calendar"
              readonly v-bind="attrs" v-on="on" :error-messages="errores.fechaVigencia"></v-text-field>
          </template>
          <v-date-picker v-model="codigoAgregar.fechaVigencia" @input="menu = false"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="12" md="7">
        <v-text-field v-model="codigoAgregar.observacion" label="Observación" />
      </v-col>
      <v-col cols="12" sm="12" md="2" style="display: flex; gap: 0.2rem">
        <v-btn color="success" @click="agregarCodigo()" style="width: 50%">Agregar</v-btn>
        <v-btn color="warning" @click="limpiarCampos()" style="width: 50%">Limpiar</v-btn>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" sm="12" md="12">
        <v-data-table dense :headers="headersCodigos" :items="codigosOrdenar" no-data-text="No hay datos">
          <template v-slot:[`item.autorizacion`]="{ item }">
            <v-chip small :color="item.codigoPropio.requiere_auditoria == true
              ? 'success'
              : 'error'
              " dark>
              {{ item.codigoPropio.requiere_auditoria == true ? "Sí" : "No" }}
            </v-chip>
          </template>
          <template v-slot:[`item.acciones`]="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="error" v-bind="attrs" v-on="on" @click="eliminar(item)">
                  mdi-close-circle-outline
                </v-icon>
              </template>
              <span>Eliminar</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>

      <v-col cols="12" sm="12" md="12" class="d-flex justify-end" v-if="codigosOrdenar.length > 0">
        <v-btn color="primary" @click="generarOrdenamiento()">Ordenar</v-btn>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" sm="12" md="12">
        <v-data-table :loading="loading" no-data-text="No hay datos" dense :headers="headersCodigosActivos"
          :items="codigosPropiosActivos" hide-default-footer>
          <template v-slot:[`item.direccionamiento_id`]="{ item }">
            <v-btn text @click="abrirModalCambiarDireccionamiento(item)">
              {{ item.rep ? item.rep.nombre : "Sin Direccionamiento" }}
            </v-btn>
          </template>
          <template v-slot:[`item.estado`]="{ item }">
            <v-chip small :color="getColorEstado(item.estado_id)" dark>{{
              item.estado.nombre
            }}</v-chip>
          </template>
          <template v-slot:[`item.acciones`]="{ item }">
            <v-tooltip top v-if="item.estado.id === 1 || item.estado.id === 4">
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="primary" v-bind="attrs" v-on="on" @click="imprimirOrden(item)">mdi-file-download</v-icon>
              </template>
              <span>Descargar</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Modal Cambiar Direccionamiento -->
    <v-dialog v-model="modalCambiarDireccionamiento">
      <v-card>
        <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">
          Cambiar Direccionamiento</v-alert>
        <v-card-text>
          <v-col cols="12" sm="12" md="12">
            <v-autocomplete no-data-text="Digite el nombre del prestador para inciar la búsqueda"
              :search-input.sync="busquedaPrestador" dense v-model="rep_id" :items="listaPrestadores" item-text="nombre"
              item-value="id" label="Prestador *" :loading="loading"></v-autocomplete>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="modalCambiarDireccionamiento = false">
            Cancelar
          </v-btn>
          <v-btn @click="cambiarDireccionamiento()" dark color="success">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "codigosPropios",
  mounted() {
    this.listarCodigosActivos();
  },
  props: ["consulta", "afiliado"],
  data: () => ({
    codigosPropios: [],
    preload: false,
    loading: false,
    menu: false,
    campoBusqueda: null,
    codigoAgregar: {
      codigoPropio: null,
      cantidad: null,
      fechaVigencia: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      observacion: null,
    },

    errores: {
      codigoPropio: [],
      cantidad: [],
      fechaVigencia: [],
    },

    headersCodigos: [
      { text: "Código", value: "codigoPropio.codigo" },
      { text: "Descripción", value: "codigoPropio.nombre" },
      { text: "Cantidad", value: "cantidad" },
      {
        text: "Vigencia Desde",
        value: "fechaVigencia",
        align: "center",
      },
      { text: "Observación", value: "observacion" },
      {
        text: "Autorización",
        value: "autorizacion",
        align: "center",
      },
      { text: "Acciones", value: "acciones", sortable: false, align: "center" },
    ],
    codigosOrdenar: [],
    codigosPropiosActivos: [],
    headersCodigosActivos: [
      { text: "Código", value: "codigo_propio.codigo" },
      { text: "Nombre", value: "codigo_propio.nombre" },
      { text: "Cantidad", value: "cantidad", align: "center" },
      { text: "Direccionamiento", value: "direccionamiento_id" },
      { text: "Fecha Vigencia", value: "fecha_vigencia" },
      { text: "Estado", value: "estado", align: "center" },
      { text: "Acciones", value: "acciones", sortable: false, align: "center" },
    ],
    rep_id: "",
    modalCambiarDireccionamiento: false,
    formCambiarDireccionamiento: {
      rep_id: null,
    },
    busquedaPrestador: null,
    listaPrestadores: [],
  }),
  watch: {
    campoBusqueda: function (newVal) {
      if (newVal && newVal.length === 4) {
        this.listarCodigosPropios();
      }
    },
    busquedaPrestador: function (newVal) {
      if (newVal && newVal.length === 4) {
        this.listarPrestadores();
      }
    },
  },
  methods: {
    listarPrestadores() {
      this.loading = true;
      this.$axios
        .post("reps/listar?page=0", {
          prestador: this.busquedaPrestador,
        })
        .then((res) => {
          this.listaPrestadores = res.data.map((rep) => {
            return {
              id: rep.id,
              nombre: `${rep.prestadores.nit}-${rep.nombre} - ${rep.municipio.nombre}`,
            };
          });
        })
        .catch((error) => {
          this.$toast.error("Ocurrió un error al cargar los prestadores");
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    listarCodigosPropios() {
      this.loading = true;
      this.$axios
        .get(`/codigo-propio/BuscarCodigoPropio/${this.campoBusqueda}`)
        .then((res) => {
          this.codigosPropios = res.data.original;
        })
        .catch((error) => {
          this.$toast.error("Ocurrió un error al cargar los códigos propios");
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    validarCampos() {
      this.errores.codigoPropio = [];
      this.errores.cantidad = [];
      this.errores.fechaVigencia = [];

      if (!this.codigoAgregar.codigoPropio) {
        this.errores.codigoPropio.push("El Código Propio es requerido");
      }

      if (!this.codigoAgregar.cantidad) {
        this.errores.cantidad.push("La cantidad es requerida");
      }

      if (!this.codigoAgregar.fechaVigencia) {
        this.errores.fechaVigencia.push("La fecha de vigencia es requerida");
      }

      return (
        this.errores.codigoPropio.length === 0 &&
        this.errores.cantidad.length === 0 &&
        this.errores.fechaVigencia.length === 0
      );
    },

    agregarCodigo() {
      if (this.validarCampos()) {
        const codigoDuplicado = this.codigosOrdenar.find(
          (codigo) =>
            codigo.codigoPropio.id === this.codigoAgregar.codigoPropio.id
        );

        if (codigoDuplicado) {
          this.$toast.error("El código propio ya ha sido agregado");
        } else {
          const nuevoCodigo = { ...this.codigoAgregar, rep: { id: this.afiliado.ips.id } };
          this.codigosOrdenar.push(nuevoCodigo);
          this.limpiarCampos();
          this.codigosPropios = [];
        }
      }
    },

    limpiarCampos() {
      this.codigoAgregar = {
        codigoPropio: null,
        cantidad: null,
        fechaVigencia: new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substr(0, 10),
        observacion: null,
      };
      this.errores = {
        codigoPropio: [],
        cantidad: [],
        fechaVigencia: [],
      };
    },

    eliminar(item) {
      const index = this.codigosOrdenar.indexOf(item);
      if (index > -1) {
        this.codigosOrdenar.splice(index, 1);
      }
    },

    async generarOrdenamiento() {
      const codigosYaOrdenados = this.codigosOrdenar.filter((codigo) =>
        this.codigosPropiosActivos.some(
          (activo) => activo.codigo_propio.id === codigo.codigoPropio.id
        )
      );

      if (codigosYaOrdenados.length > 0) {
        this.$swal({
          title: "Error",
          text: "Uno o más códigos seleccionados ya han sido ordenados previamente.",
          type: "error",
        });
        return;
      }

      try {
        const result = await this.$swal({
          title: "¿Desea generar el ordenamiento?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#d33",
          confirmButtonText: "Generar",
        });

        if (result.value) {
          this.preload = true;

          const res = await this.$axios.post(
            `/ordenamiento/generarOrdenamiento/${this.consulta}/4`,
            this.codigosOrdenar
          );

          this.$swal({
            title: res.data.mensaje,
            type: res.data.type,
          });

          if (res.data.type === "success") {
            this.codigosOrdenar = [];
            this.listarCodigosActivos();
          }
        }
      } catch (e) {
        this.$toast.error("Ocurrió un error al generar el ordenamiento");
      } finally {
        this.preload = false;
      }
    },

    listarCodigosActivos() {
      this.loading = true;
      this.$axios
        .get(`/ordenamiento/ordenes-activas/${this.consulta}/4`)
        .then((res) => {
          this.codigosPropiosActivos = res.data;
        })
        .catch((error) => {
          this.$toast.error("Ocurrió un error al cargar las ordenes activas");
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    getColorEstado(id) {
      switch (id) {
        //Activo
        case 1:
          return "success";
        //Anulado
        case 2:
          return "error";
        //Pendiente Autorizar
        case 3:
          return "warning";
        //Inadecuado
        case 5:
          return "error";
        //Anexo 3
        case 42:
          return "primary";
      }
    },

    imprimirOrden(item) {
      if (item.rep_id === null) {
        this.$swal({
          title: "Error",
          text: "El servicio no tiene no tiene direccionamiento.",
          type: "error",
        });
        return;
      }
      let pdf = {
        tipo: "codigoPropio",
        id: item.orden_id,
        detalles: {
          id: item.id,
        },
      };
      this.$axios
        .post("/pdf", pdf, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          let blob = new Blob([res.data], {
            type: "application/pdf",
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
        });
    },

    abrirModalCambiarDireccionamiento(item) {
      (this.rep_id = ""), (this.modalCambiarDireccionamiento = true);
      this.formCambiarDireccionamiento.orden_codigo_propio_id = item.id;
    },

    cambiarDireccionamiento() {
      if (this.rep_id === "" || this.rep_id === null) {
        this.$toast.error("Debe seleccionar un prestador");
        return;
      }

      this.preload = true;
      const data = {
        rep_id: this.rep_id,
        orden_codigo_propio_id:
          this.formCambiarDireccionamiento.orden_codigo_propio_id,
      };
      this.$axios
        .post("ordenamiento/asignarDireccionamiento", data)
        .then((res) => {
          this.$swal({
            title: "Orden direccionada con éxito",
            type: "success",
          });
          this.listarCodigosActivos();
        })
        .catch((error) => {
          this.$toast.error("Ocurrió un error al cambiar el direccionamiento.");
          console.log(error);
        })
        .finally(() => {
          this.modalCambiarDireccionamiento = false;
          this.preload = false;
        });
    },
  },
};
</script>
