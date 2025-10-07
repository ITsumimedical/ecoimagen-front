<template>
  <v-menu v-model="menu" offset-y transition="slide-x-transition" :close-on-content-click="false"
    :close-on-click="false" :open-on-hover="false" :retain-focus="true" :disable-keys="true">
    <template v-slot:activator="{ on }">
      <v-badge color="sumimedical" bordered :content="items && items.length
        ? items.length > 99
          ? '99+'
          : items.length
        : '0'
        " offset-x="22" offset-y="22">
        <v-btn icon v-on="on">
          <v-icon style="color: white">mdi-bell-outline</v-icon>
        </v-btn>
      </v-badge>
    </template>

    <v-card>
      <v-toolbar dense flat>
        <img src="/images/ojo.svg" alt="" height="50px" width="50px">
        <v-toolbar-title>Notificaciones</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon small @click="menu = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text>
        <v-list shaped three-line dense max-width="450" :style="{
          maxHeight: items.length > 9 ? '700px' : 'auto',
          overflowY: items.length > 9 ? 'auto' : 'visible',
        }">
          <div v-if="items.length === 0" class="pa-4 text-center caption">
            No tienes notificaciones
          </div>
          <template v-else>
            <v-list-item v-for="(item, index) in items" :key="index" @click.stop>
              <v-list-item-icon>
                <v-icon color="error" dark>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }} </v-list-item-title>
                <v-list-item-subtitle class="caption">
                  {{ timeAgo(item.time ?? item.fecha) }}
                </v-list-item-subtitle>

              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon @click="verDetalle(item)">
                  <v-icon color="warning">mdi-eye</v-icon>
                </v-btn>

              </v-list-item-action>

            </v-list-item>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small @click="bandejaRedireccionar()" color="teal" dark class="mt-2">Mi bandeja <v-icon dense
                  right>mdi-email-arrow-right-outline</v-icon></v-btn>
            </v-card-actions>

          </template>
        </v-list>

      </v-card-text>

    </v-card>

    <v-dialog v-model="modalDetalle" max-width="475px" scrim="transparent" persistent>
      <detalle-notificacion :notificacion="notificacionSeleccionada" @cerrarModal="modalDetalle = false" />
    </v-dialog>

  </v-menu>
</template>

<script>
import DetalleNotificacion from '../usuario/detalleNotificacion.vue';

export default {

  components: {
    DetalleNotificacion
  },

  data() {
    return {
      menu: false,
      items: [],
      audioCtx: null,
      unlocked: false,
      notificacionSeleccionada: {},
      modalDetalle: false,
    };
  },

  async mounted() {
    const uid = this.$store.state.auth.usuario.id;

    this.buscarNotificaciones();

    this.$socket.on(`usuario.${uid}`, (payload) => {
      if (!payload) return;

      if (payload.accion === 'eliminar' && payload.id) {
        const id = String(payload.id).replace(/"/g, '').trim();

        this.items = this.items.filter(n =>
          String(n.id).replace(/"/g, '').trim() !== id
        );

        return;
      }

      const data = payload.data || payload;
      this.items.unshift({
        id: data.id,
        title: data.titulo || "Nueva notificación",
        mensaje: data.mensaje,
        icon: "mdi-bell-outline",
        time: data.fecha,
        ruta: data.ruta
      });

      this.beep();
    });

  },

  methods: {

    async buscarNotificaciones() {
      try {
        const res = await this.$axios.get("/notificaciones/listar");
        this.items = res.data.map((n) => ({
          id: n.id,
          title: n.titulo || "Nueva notificación",
          mensaje: n.mensaje,
          icon: "mdi-bell-outline",
          time: n.fecha,
          ruta: n.ruta
        }));
      } catch (error) {
        // this.$toast.error('Ha ocurrido un error al buscar las notificaciones')
      }
    },


    beep() {
      if (!this.audioCtx || !this.unlocked) return;
      const ctx = this.audioCtx;

      const playTone = (freq, startTime, duration = 0.25, volume = 0.15) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1500, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;

      playTone(600, now, 0.2);
      playTone(750, now + 0.25, 0.2);
      playTone(900, now + 0.5, 0.25);
    },

    timeAgo(fecha) {
      if (!fecha) return '';
      const ahora = new Date();
      const f = new Date(fecha.replace(' ', 'T'));
      const diff = Math.floor((ahora - f) / 1000);

      if (diff <= 0) return 'Ahora';
      if (diff < 60) return `Hace ${diff} segundos`;
      if (diff < 3600) {
        const min = Math.floor(diff / 60);
        return `Hace ${min} minuto${min !== 1 ? 's' : ''}`;
      }
      if (diff < 86400) {
        const h = Math.floor(diff / 3600);
        return `Hace ${h} hora${h !== 1 ? 's' : ''}`;
      }
      const d = Math.floor(diff / 86400);
      return `Hace ${d} día${d !== 1 ? 's' : ''}`;
    },

    bandejaRedireccionar() {
      this.$router.push('/perfil');
      this.menu = false;
    },

    verDetalle(item) {
      this.notificacionSeleccionada = { ...item };
      this.modalDetalle = true;
    }

  },
};
</script>
