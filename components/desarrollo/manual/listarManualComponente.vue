<template>
  <div>
    <v-data-table :headers="headers" :items="manuales" class="elevation-1" :loading="loading" loading-text="Cargando..."
      hide-default-footer>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="primary" small class="mr-2" v-bind="attrs" v-on="on" @click="editItem(item)">
              mdi-pencil
            </v-icon>
          </template>
          <span>Editar</span>
        </v-tooltip>
      </template>
      <template v-slot:no-data>
          No hay información para mostrar
      </template>
      <editarManual />
    </v-data-table>
    <template>
      <div class="text-center">
        <v-pagination v-model="paginate.page" :length="paginate.total" :total-visible="7" @input="listarBlogs()">
        </v-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  import editarManual from "@/components/desarrollo/manual/editarManualComponente.vue";
  import {
    listarBlogs
  } from '@/api/blogs/blog'
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
      editarManual
    },
    data() {
      return {
        loading: false,
        manuales: [],
        paginate: {
          total: 0,
          page: 1
        },

        headers: [{
            text: 'id',
            value: 'id',
          },
          {
            text: 'Nombre',
            value: 'titulo'
          },
          {
            text: 'Acciones',
            value: 'actions',
          },
        ],
      };
    },
    created() {
      this.listarBlogs();
    },
    methods: {
      async listarBlogs() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarBlogs(this.paginate.page))
          this.manuales = data.data.data
          this.paginate.total = data.data.last_page
          this.paginate.page = data.data.current_page
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },
      editItem(item) {
        this.editarManual = item
        this.dialogoEditar = true
      },
    }

  }

</script>

<style>

</style>
