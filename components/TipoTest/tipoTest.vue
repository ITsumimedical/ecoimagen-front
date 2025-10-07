<template>
  <div>
    <v-data-table dense :headers="headers" :search="buscar" sort-by="id" :items="tipoTest" loading-text="Cargando..."
      no-data-text="Sin datos para mostrar" :loading="loading" :disabled="loading">

      <template v-slot:top>
        <v-card-title>
          <v-btn small color="boton" class="mb-2 white--text" @click="abrirDialogoCrear">
            Nuevo
            <v-icon right>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscar" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="warning" v-bind="attrs" v-on="on" @click="abrirDialogoEditar(item)">
              mdi-pencil
            </v-icon>
          </template>
          <span>Editar</span>
        </v-tooltip>
      </template>

    </v-data-table>

    <v-dialog persistent max-width="900px" v-model="crearTipoTest">
      <v-card>
        <v-alert icon="mdi-checkbox-marked-circle-plus-outline" text dense :color="editar ? 'warning' : 'info'">
          <b>{{ editar ? 'Editar tipo test' : 'Crear tipo test' }}</b>
        </v-alert>
        <v-card-text>
          <v-col>
            <v-text-field label="Nombre" v-model="form.nombre" outlined dense></v-text-field>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" small @click="cerrarDialog()" dark>Cerrar</v-btn>
          <v-btn small :color="editar ? 'warning' : 'success'" @click="guardarTest()" :loading="cargando"
            :disabled="cargando">
            {{ editar ? 'Actualizar' : 'Guardar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        buscar: '',
        loading: false,
        cargando: false,
        tipoTest: [],
        crearTipoTest: false,
        editar: false,
        form: {
          id: null,
          nombre: ''
        },
        headers: [{
            text: 'Id',
            value: 'id'
          },
          {
            text: 'Nombre',
            value: 'nombre'
          },
          {
            text: 'Acciones',
            value: 'actions'
          }
        ]
      };
    },

    mounted() {
      this.listarTipoTest();
    },

    methods: {
      listarTipoTest() {
        this.loading = true;
        this.$axios.get('tipoTest/listar').then(res => {
          this.tipoTest = res.data;
          this.loading = false;
        }).catch(res => {
          this.loading = false;
          this.$toast.error('Error al listar los tipos de test');
        });
      },

      abrirDialogoCrear() {
        this.editar = false;
        this.form = {
          id: null,
          nombre: ''
        };
        this.crearTipoTest = true;
      },

      abrirDialogoEditar(item) {
        this.editar = true;
        this.form = {
          ...item
        };
        this.crearTipoTest = true;
      },

      guardarTest() {
        this.cargando = true;
        this.form.nombre = this.form.nombre.toUpperCase();
        const url = this.editar ? `tipoTest/actualizar/${this.form.id}` : 'tipoTest/crearTipoTest';
        const metodo = this.editar ? 'put' : 'post';

        this.$axios[metodo](url, this.form).then(res => {
          this.$toast.success(`Se ha ${this.editar ? 'actualizado' : 'creado'} con éxito`);
          this.crearTipoTest = false;
          this.listarTipoTest();
        }).catch(res => {
          this.$toast.error(`Error al ${this.editar ? 'actualizar' : 'crear'}`);
        }).finally(() => {
          this.cargando = false;
        });
      },

      cerrarDialog() {
        this.form = {
          id: '',
          nombre: ''
        },
        this.crearTipoTest = false
      }
    }
  };

</script>
