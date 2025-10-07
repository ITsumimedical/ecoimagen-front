<template>
  <div>
    <Roles />
  </div>
</template>

<script>
  import Roles from '@/components/admin/Roles.vue'
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'roles',
    components: {
      Roles
    },
  }

</script>
<style>

</style>
