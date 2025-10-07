<template>
    <TurnoLlamadoComponent />
</template>
<script>
import TurnoLlamadoComponent from "@/components/turno/TurnoLlamadoComponent.vue"
export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    layout: 'turnero',
    auth: true,
    components:{
        TurnoLlamadoComponent
    }
}
</script>
