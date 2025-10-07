<template>
  <div>
    <v-toolbar color="titulo">
      <v-toolbar-title style="color:white">Manuales</v-toolbar-title>
      <v-divider style="background: white" class="mx-4" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <crearManual />
    </v-toolbar>
    <listarBlog />
  </div>
</template>

<script>
  import crearManual from "@/components/desarrollo/manual/crearManualComponente.vue";
  import listarBlog from "@/components/desarrollo/manual/listarManualComponente.vue";
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceManuales',
    components: {
      crearManual,
      listarBlog
    },
    data() {
      return {

      };
    },
    methods: {
      ErrorEntrada(errors) {
        for (const key in this.errors) {
          if (key in errors) {
            this.errors[key] = errors[key].join(',')
          }
        }
      },

      limpiarError() {
        for (const key in this.errors) {
          this.errors[key] = ''
        }
      },

    },
  }

</script>
