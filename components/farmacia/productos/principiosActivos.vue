<template>
  <div>
    <v-data-table :headers="headers" :items="principiosCreados" :search="buscar" dense :footer-props="{
      itemsPerPageText: 'Filas por página:'}" :loading="cargandoDatos">

      <template v-slot:top>
        <v-card-title>
          <v-btn small color="boton" class="mb-2 white--text" @click="abrirDialogoCrear">
            Nuevo
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscar" label="Buscar" append-icon="mdi-magnify" hide-details single-line></v-text-field>
        </v-card-title>
      </template>

      <template v-slot:[`item.codigo`]="{ item }">
        <v-chip small label  :color="item.codigo ? 'warning' : ''">
            {{ item.codigo || 'Codigo no registrado' }}
        </v-chip>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on" @click="abrirDialogoEditar(item)">
              mdi-pencil
            </v-icon>
          </template>
          <span>Editar</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="error" small class="mr-2" v-bind="attrs" v-on="on" @click="eliminar(item)">
              mdi-delete-alert
            </v-icon>
          </template>
          <span>Eliminar principio activo</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <v-dialog max-width="700px" v-model="principioActivo" persistent>
      <v-card>
        <v-alert text dense :color="modo === 'crear' ? 'success' : 'warning' " border="left" icon="mdi-pill">
          <b>{{ modo === 'crear' ? 'Crear nuevo principio activo' : 'Editar principio activo' }}</b>
        </v-alert>
        <v-card-text>
          <v-col cols="12" sm="12" md="12">
            <v-text-field label="Nombre" dense outlined v-model="principio.nombre"></v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-text-field label="Codigo" dense outlined v-model="principio.codigo"></v-text-field>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" small @click="cerrarDialog()" dark>
            Cerrar
          </v-btn>
          <v-btn :color="modo === 'crear' ? 'success' : 'warning'" @click="guardarPrincipio()" small dark :loading="loading">
            {{ modo === 'crear' ? 'Guardar' : 'Actualizar' }}
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
      principioActivo: false,
      buscar: '',
      principiosCreados: [],
      cargandoDatos: false,
      principio: {
        nombre: '',
        codigo: ''
      },
      modo: 'crear',
      loading: false,
      headers: [
        {
          text: 'Id',
		  sortable: false,
          value: 'id'
        },
        {
          text: 'Principio',
		  sortable: false,
          value: 'nombre'
        },
        {
            text: 'Código',
            value: 'codigo'
        },
        {
          text: 'Acciones',
		  sortable: false,
          value:'actions'
        }
      ]
    }
  },

  mounted() {
    this.listarPrincipios()
  },

  methods: {
    listarPrincipios() {
      this.cargandoDatos = true;
      this.$axios.get('principios-activos/listar').then((res) => {
        this.principiosCreados = res.data
      }).catch((error) => {
        console.error(error)
        this.$toast.error('Error al listar')
      }).finally(() => {
        this.cargandoDatos = false;
      })
    },

    abrirDialogoCrear() {
      this.modo = 'crear';
      this.principio.nombre = ''; // Limpiar el campo
      this.principioActivo = true;
    },

    abrirDialogoEditar(item) {
      this.modo = 'editar';
      this.principio = { ...item }; // Cargar los datos del principio a editar
      this.principioActivo = true;
    },

    guardarPrincipio() {
      this.loading = true;
      const url = this.modo === 'crear' ? 'principios-activos/crearPrincipio' : `principios-activos/actualizar/${this.principio.id}`;
      const method = this.modo === 'crear' ? 'post' : 'put';

      this.$axios[method](url, {
        nombre: this.principio.nombre,
        codigo: this.principio.codigo
      }).then(() => {
        this.$toast.success(this.modo === 'crear' ? 'Creado con éxito' : 'Actualizado con éxito');
        this.listarPrincipios();
        this.principioActivo = false }).catch((error) => {
        this.$toast.error(this.modo === 'crear' ? 'Error al crear' : 'Error al actualizar');
      }).finally(() => {
        this.loading = false;
      })
    },

    cerrarDialog()
    {
      this.principioActivo = false;
      this.principio.nombre = ''
    },

    eliminar(item) {
        return this.$swal({
        title: "Atención!",
        text: "¿Está seguro de eliminar este principio activo?",
        type: "warning",
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        }).then((res) => {
            if(res.value) {
                this.$axios.delete('principios-activos/eliminar-principio/' + item.id).then(() => {
                    this.$toast.success('Forma Farmaceutica eliminada correctamente');
                    this.listarPrincipios()
                })
            }
        }).catch((error) => {
            this.$toast.error('Error al eliminar la forma farmaceutica');
            console.log(error.response.data.error)
        })
    }
  }
}
</script>
