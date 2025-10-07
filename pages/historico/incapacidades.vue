<template>
  <div>
    <v-card>
      <v-card elevation="0">
        <v-toolbar-title>
          <div class="d-flex align-center">
            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
            <span>HISTÓRICO DE INCAPACIDADES</span>
          </div>
        </v-toolbar-title>
      </v-card>
      <v-card-text>
        <v-col cols="12" md="9">
          <v-row align="center">
            <v-col cols="8" md="8">
              <v-text-field v-model="documento" dense outlined label="Número de identificación" clearable
                @keyup.enter="consultarIncapacidades()" @click:clear="limpiar()" autofocus>
              </v-text-field>
            </v-col>
            <v-col cols="4" md="4">
              <v-btn small color="primary" class="mb-9 ma-3" :loading="preload" @click="consultarIncapacidades()">Buscar
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-card-text>
      <v-data-table v-if="mostrarTabla" :headers="headers" :items="historicoIncapacidades"
        loading-text="Cargando... por favor espere" hide-default-footer>
        <!-- Permite editar la fecha inicial de la incapacidad OJO este permiso solo lo puede tener PINTO-->
        <template v-slot:[`item.fecha_inicio`]="{ item }" v-if="$can('editar_fecha_inicial_incapacidad')">
          <td>

            <v-edit-dialog :return-value.sync="item.fecha_inicio" @save="guardarEdicion(item, 'fecha_inicio', $event)"
              @cancel="cancelarEdicion">
              {{ item.fecha_inicio }}
              <template v-slot:input>
                <b style="color:red">Editar fecha inicio</b>
                <v-text-field v-model="item.fecha_inicio" outlined dense></v-text-field>
              </template>
            </v-edit-dialog>
          </td>
        </template>

        <!-- Permite editar la fecha final de la incapacidad OJO este permiso solo lo puede tener PINTO-->
        <template v-slot:[`item.fecha_final`]="{ item }" v-if="$can('editar_fecha_final_incapacidad')">
          <td>
            <v-edit-dialog :return-value.sync="item.fecha_final" @save="guardarEdicion(item, 'fecha_final', $event)"
              @cancel="cancelarEdicion">
              {{ item.fecha_final }}
              <template v-slot:input>
                <b style="color:purple">Editar fecha final</b>
                <v-text-field v-model="item.fecha_final" outlined dense></v-text-field>
              </template>
            </v-edit-dialog>
          </td>
        </template>

        <template v-slot:[`item.imprimir`]="{ item }">
          <td class="text-center">
            <v-tooltip bottom v-if="item.estado == 'Activo'">
              <template v-slot:activator="{ on }">
                <v-btn icon color="success" v-on="on" @click="imprimir(item.id)">
                  <v-icon>mdi-file-download</v-icon>
                </v-btn>
              </template>
              <span>Imprimir incapacidad</span>
            </v-tooltip>

            <v-tooltip bottom v-if="$can('incapacidades.anular') && item.estado == 'Activo'">
              <template v-slot:activator="{ on }">
                <v-btn icon color="error" v-on="on" @click="anular(item.id)">
                  <v-icon>mdi-close-circle-outline</v-icon>
                </v-btn>
              </template>
              <span>Anular incapacidad</span>
            </v-tooltip>

            <v-tooltip bottom v-if="item.estado == 'Anulado'">
              <template v-slot:activator="{ on }">
                <v-btn icon color="info" v-on="on" @click="verDetalleAnulacion(item)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </template>
              <span>Detalle de anulación</span>
            </v-tooltip>
          </td>
        </template>
        <template v-slot:no-data> No hay datos disponibles </template>

        <template v-slot:[`item.estado`]="{ item }">
          <v-chip :color="getColor(item.estado)" dark small>
            {{ item.estado == 'Activo' ? 'Activo' : 'Inactivo' }}
          </v-chip>
        </template>
      </v-data-table>

      <v-pagination v-model="pagina" :length="totalPages" @input="consultarIncapacidades" :total-visible="9">
      </v-pagination>
    </v-card>
    <v-dialog v-model="preload" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Procesando Información
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Dialogo de anulación -->
    <v-dialog v-model="dialogoAnular" max-width="700px" persistent>
      <v-card>
        <v-container fluid>
          <v-alert icon="mdi-cancel" text dense border="left" color="blue-grey">Proceso de anulación de incapacidad
          </v-alert>
          <v-row dense>
            <v-col cols="12">
              <v-textarea auto-grow label="Observaciones" dense v-model="formAnulacion.observacion"></v-textarea>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small color="error" @click="dialogoAnular = false">Cancelar</v-btn>
            <v-btn small color="success" @click="anularIncapacidad(incapacidad_id)">Guardar</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- Dialogo detalle anulación -->
    <v-dialog v-model="dialogoDetalle" persistent max-width="700px">
      <v-card>
        <v-alert text dense border="left" color="error">{{itemDetalle?.cambio_orden.accion}}</v-alert>
        <v-container>
          <v-col cols="12">
            <v-icon left color="error">mdi-account-arrow-right</v-icon><b>Usuario anula: </b>
            {{itemDetalle?.cambio_orden.user.operador.nombre_completo}}
          </v-col>
          <v-col cols="12">
            <v-icon left color="error">mdi-calendar-arrow-right</v-icon><b>Fecha anulación: </b>
            {{itemDetalle?.cambio_orden.created_at.substr(0,10)}}
          </v-col>
          <v-col cols="12">
            <v-icon left color="error">mdi-note-text-outline</v-icon><b>Observación anulación: </b>
            {{itemDetalle?.cambio_orden.observacion}}
          </v-col>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small @click="dialogoDetalle = false" color="error">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: "WorkspaceJsonIncapacidades",
    middleware({
      $can,
      redirect
    }) {
      if (!$can("historico.atenciones.incapacidades")) {
        return redirect("/");
      }
    },
    data: () => ({
      documento: "",
      historicoIncapacidades: [],
      mostrarTabla: false,
      preload: false,
      headers: [{
          text: "id",
          align: "start",
          sortable: false,
          value: "id",
        },
        {
          text: "Cédula",
          value: "numero_documento",
        },
        {
          text: "Afiliado",
          value: "afiliado",
        },
        {
          text: "Edad",
          value: "edad_cumplida",
        },
        {
          text: "Días",
          value: "dias",
        },
        {
          text: "Tipo",
          value: "contingencia",
        },
        {
          text: "F. Inicio",
          value: "fecha_inicio",
        },
        {
          text: "F. Final",
          value: "fecha_final",
        },
        {
          text: "Prorroga",
          value: "prorroga",
        },
        {
          text: "Labora",
          value: "colegio",
        },
        {
          text: "realizada por",
          value: "operadornombre",
        },
        {
          text: "consulta",
          value: "consulta_id",
        },
        {
          text: "Estado",
          value: "estado",
        },
        {
          text: "Acciones",
          value: "imprimir",
        },
      ],
      pagina: 1,
      cantidad: 10,
      totalPages: 0,
      editedIndex: -1,
      editedItem: {
        fecha_inicio: "",
        fecha_final: "",
      },
      dialogoAnular: false,
      formAnulacion: {
        observacion: '',
        incapacidad_id: null
      },
      dialogoDetalle: false,
      itemDetalle: null,
    }),
    methods: {
      consultarIncapacidades() {
        this.preload = true;
        if (this.documento == "") {
          return this.$swal({
            title: "¡Debe ingresar la cédula de un afiliado!",
            type: "warning",
          });
        }
        this.$axios.get(`/incapacidades/historico-incapacidad`, {
            params: {
              pagina: this.pagina,
              cantidad: this.cantidad,
              documento: this.documento,
            },
          })
          .then((res) => {
            if (res.data.data.length === 0) {
              this.$swal({
                title: "No hay datos de incapacidades",
                text: "No se encontraron datos de incapacidades para el afiliado con cédula " +
                  this.documento,
                type: "info",
              });
            } else {
              this.historicoIncapacidades = res.data.data;
              this.totalPages = res.data.last_page;
              this.mostrarTabla = true;
              this.preload = false;
            }
            this.preload = false;
          })
          .catch((e) => {
            this.preload = false;
            this.$swal({
              title: "Error",
              text: "Ocurrió un error al consultar las incapacidades",
              type: "error",
            });
          });
      },

      limpiar() {
        this.documento = "";
        this.historicoIncapacidades = [];
        this.mostrarTabla = false;
      },

      imprimir(item) {
        this.preload = true;
        const data = {
          incapacidad_id: item,
          tipo: "incapacidad",
        };
        this.$axios
          .post("pdf", data, {
            responseType: "arraybuffer",
          })
          .then((res) => {
            this.preload = false;
            let blob = new Blob([res.data], {
              type: "application/pdf",
            });
            let link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            window.open(link.href, "_blank");
          }).catch(res => {
            this.preload = false;
          });
      },

      anular(item) {
        this.dialogoAnular = true
        this.incapacidad_id = item
      },

      anularIncapacidad(incapacidad_id) {
        if (!this.formAnulacion.observacion) {
          return this.$toast.error('El campo observaciones es obligatorio!.')
        }
        this.formAnulacion.incapacidad_id = incapacidad_id
        this.$axios.post(`incapacidades/anularIncapacidad`, this.formAnulacion).then(response => {
          this.dialogoAnular = false
          this.consultarIncapacidades()
          this.formAnulacion.observacion = null
          this.formAnulacion.incapacidad_id = null
        }).catch(error => {
          console.error('Error', error);
        });
      },

      guardarEdicion(item) {
        this.$axios.put(`/incapacidades/editarFecha/${item.id}`, item).then(response => {
          console.log('Datos actualizados en el servidor:', response.data);
        }).catch(error => {
          console.error('Error al actualizar datos:', error);
        });

        this.editedIndex = -1;
      },

      cancelarEdicion() {
        this.editedIndex = -1;
      },

      editarItem(item, index) {
        this.editedIndex = index;
        this.editedItem = Object.assign({}, item);
      },

      getColor(estado) {
        if (estado == 'Activo') return 'green'
        else return 'red'
      },

      verDetalleAnulacion(item) {
        this.dialogoDetalle = true
        this.itemDetalle = item
      }
    },

  };

</script>

<style lang="scss" scoped>
</style>
