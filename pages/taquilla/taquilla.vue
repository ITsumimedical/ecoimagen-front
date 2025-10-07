<template>
  <v-card>
    <v-card-title class="justify-space-between card">
      <span class="white--text text-h5">Taquillas</span>
      <!-- boton de crear -->
      <v-btn color="boton" dark @click="crear()">Crear</v-btn>
    </v-card-title>

    <!-- tabla -->
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Area</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="taquilla in taquillas" :key="taquilla.id">
            <td>{{ taquilla.id }}</td>
            <td>{{ taquilla.nombre }}</td>
            <td>{{ taquilla.area.nombre }}</td>
            <td>
    <!-- boton de editar -->
    <v-icon color="warning" @click="editar(taquilla)">mdi-pencil</v-icon>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <!-- Paginacion -->
    <div class="text-center">
      <v-pagination v-model="paginacion.current" :length="paginacion.total" @input="getTaquillas()" circle>
      </v-pagination>
    </div>

    <!-- Dialogo para llamar a la taquilla -->
    <v-dialog v-model="modal" persistent width="40%">
      <component :is="componente" @respuestaComponente="itemCreado()" :datos="is_editar" />
    </v-dialog>

  </v-card>
</template>
<script>
  import FormTaquillaComponent from "@/components/taquilla/FormTaquillaComponent.vue"
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },

    components: {
      FormTaquillaComponent
    },

    data() {

      return {
        componente: '',
        is_editar: {
          editar: false,
          taquilla_id: ''
        },
        taquillas: [],
        modal: false,
        paginacion: {
          current: 1,
          total: 0
        },
      }
    },

    created() {
      this.getTaquillas()
    },

    methods: {

      /**
       * listar taquillar
       * @author juan david
       */
      async getTaquillas() {
        try {
          const response = await this.$axios.get('/taquilla?page=' + this.paginacion.current)
          this.paginacion.current = response.data.current_page
          this.paginacion.total = response.data.last_page
          this.taquillas = response.data.data
        } catch (error) {
          this.$toast.error('No se ha podido cargar los datos');
        }
      },

      /**
       * modal de crear
       * @author juan david
       */
      crear() {
        this.modal = true;
        this.componente = 'FormTaquillaComponent'
      },

      /**
       * modal editar
       * @author juan david
       */
      editar(taquilla) {
        this.modal = true;
        this.is_editar.nombre = taquilla.nombre
        this.is_editar.area_clinica_id = parseInt(taquilla.area.id)
        this.is_editar.editar = true;
        this.is_editar.taquilla_id = taquilla.id;
        this.componente = 'FormTaquillaComponent'
      },

      /**
       * cierre del modal
       * @or juan david
       */
      itemCreado() {
        this.modal = false;
        this.is_editar.nombre = null;
        this.is_editar.area_clinica_id = null;
        this.is_editar.editar = false;
        this.is_editar.taquilla_id = null;
        this.getTaquillas();
      }

    }
  }

</script>
