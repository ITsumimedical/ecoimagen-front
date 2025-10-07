<template>
  <div>
    <v-card elevation="0">
      <v-toolbar-title>
        <v-card-title>
          <v-toolbar flat>
            <v-toolbar-title>
              <div class="d-flex align-center">
                <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                <span>Seguimientos</span>
              </div>
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
          </v-toolbar>
        </v-card-title>
      </v-toolbar-title>
    </v-card>
    <!-- Data table -->
    <v-data-table hide-default-footer disable-pagination :items="ingresos" dense :headers="headersIngresos">
      <template v-slot:[`item.estancia_total`]="{ item }">
        <v-chip small dark :class="semaforo(item.estancia_total)">
          {{ `${item.estancia_total} días` }}</v-chip>
      </template>
      <template v-slot:[`item.acciones`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on" @click="gestionar(item)">
              mdi-pencil
            </v-icon>
          </template>
          <span>Gestionar</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <v-row no-gutters>
      <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
        <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
          @input="listarIngresoConcurrencia()">
        </v-pagination>
      </v-col>
      <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
        <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
          @change="listarIngresoConcurrencia()">
        </v-select>
      </v-col>
    </v-row>
    <v-dialog v-model="modalGestion" persistent fullscreen>
      <v-card>
        <FormConcurrencia :ingresoConcurrencia="ingreso" />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="error" @click="cerrarModal()">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import FormConcurrencia from '~/components/concurrencia/FormConcurrencia.vue';
  export default {
    components: {
      FormConcurrencia
    },
    name: 'WorkspaceJsonSeguimiento',

    data() {
      return {
        ingreso: {},
        modalGestion: false,
        ingresos: [],
        pagina: 1,
        total: 0,
        opciones: [5, 10, 20, 50, 100],
        opcionActual: 5,
        filtro: {
          nombre: null
        },
        headersIngresos: [{
            text: 'id',
            value: 'id',
          },
          {
            text: 'Afiliado',
            value: 'afiliado.nombre_completo',
          },
          {
            text: 'Documento',
            value: 'afiliado.numero_documento',
          },
          {
            text: 'Especialidad',
            value: 'especialidad.nombre',
          },
          {
            text: 'Cie10 ingreso',
            value: 'cie10.nombre',
          },
          {
            text: 'Fecha registro ingreso',
            value: 'fecha_creacion',
            align: 'center',
          },
          {
            text: 'Fecha ingreso paciente',
            value: 'fecha_ingreso',
            align: 'center',
          },
          {
            text: 'Atendido en',
            value: 'rep.nombre',
            align: 'center',
          },
          {
            text: 'Días de estancia',
            value: 'estancia_total',
            align: 'center',
          },
          {
            text: 'Acciones',
            value: 'acciones',
            sortable: false,
            align: 'center',
          },
        ],
      };
    },

    mounted() {
      this.listarIngresoConcurrencia();
    },

    methods: {

      listarIngresoConcurrencia() {
        this.$axios.post('/concurrencia/listarIngreso?page=' + this.pagina + '&cant=' + this.opcionActual, this.filtro)
          .then(res => {
            this.ingresos = res.data.data;
            this.total = res.data.last_page;
          }).catch(e => {
            console.log(e);

          })
      },

      semaforo(dias) {
        return dias <= 3 ? "success" : dias <= 5 ? "warning" : "error";
      },

      gestionar(item) {
        this.ingreso = item
        this.modalGestion = true;
      },

      cerrarModal() {
        this.modalGestion = false
        setTimeout(() => {
          window.location.reload(true);
        }, 500);
      }

    },
  };

</script>
