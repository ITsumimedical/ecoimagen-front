<template>
  <div>
    <h1>Reportes de la mesa de ayuda!.</h1>
  </div>
</template>

<script>
export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
  name: 'WorkspaceJsonReportes',

  data() {
    return {

    };
  },

  mounted() {

  },

  methods: {

  },
};
</script>

<style lang="scss" scoped>

</style>
