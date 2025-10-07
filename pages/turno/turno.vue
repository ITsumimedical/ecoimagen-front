<template>
  <turnos />
</template>

<script>
  import turnos from "@/components/turno/turno.vue"
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'turnero',
    components: {
      turnos
    }
  }
</script>
