<template>
  <div>
    <v-col cols="12">
      <v-alert class="text-center" text dense border="left" color="info" icon="mdi-sitemap-outline">
        <b>ECOMAPA</b>
      </v-alert>
    </v-col>
    <v-container fluid v-if="mostrarWorkspace">
      <v-row dense>
        <v-col cols="2" ref="toolbox" class="toolbox">
          <div class="tool" v-for="tool in tools" :key="tool.id" :data-type="tool.class">
            <v-icon>{{ obtenerNombreIcono(tool.class) }}</v-icon>
            <span :class="tool.class">{{ tool.label }}</span>
          </div>
        </v-col>

        <v-col cols="10">
          <v-btn @click="activarDibujo()" color="primary" small>Comenzar a Dibujar</v-btn>
          <v-btn @click="dejarDeDibujar()" color="error" small>Dejar de Dibujar</v-btn>
          <v-btn @click="guardarEcomapa()" color="success" small>Guardar Ecomapa</v-btn>

          <div ref="workspace" class="workspace" @mousedown="comenzarDibujo">
            <v-alert class="text-center" text dense border="bottom" color="blue-grey">Arrastre los elementos a este
              panel para realizar el ecomapa</v-alert>
            <svg ref="svgLayer" class="svg-layer"></svg>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <div v-if="imagenEcomapa">
      <img :src="imagenEcomapa" alt="Ecomapa" />
    </div>

    <!-- Diálogo para editar información -->
    <v-dialog v-model="dialogoVisible" max-width="400">
      <v-card>
        <v-alert text dense border="left" color="info" icon="mdi-information-variant">Editar Información</v-alert>
        <v-card-text>
          <v-text-field dense v-model="elementoEnEdicion.nombre" label="Nombre" outlined
            :rules="[v => !!v || 'El nombre es obligatorio']" />
          <v-text-field dense v-model="elementoEnEdicion.edad" label="Edad" type="number" outlined />
          <v-select dense v-model="elementoEnEdicion.objetivo_relacion" :items="opcionesRelaciones"
            label="Relacionar con" outlined multiple />
          <!-- <v-select dense v-model="elementoEnEdicion.tipo_relacion" :items="tipoRelaciones" label="Tipo de Relación"
            outlined /> -->
          <v-checkbox dense v-model="elementoEnEdicion.principal" label="Marcar como principal"></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small text @click="dialogoVisible = false" color="error">Cerrar</v-btn>
          <v-btn small color="success" :disabled="!esFormularioValido" @click="guardarAtributosElemento()">Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
  import dragula from "dragula";
  import "dragula/dist/dragula.css";
  import html2canvas from "html2canvas";

  export default {
    props: ['datos', 'resumen'],
    data() {
      return {
        principal: false,
        mostrarWorkspace: true,
        imagenEcomapa: null,
        dibujando: false,
        historialDibujo: [],
        lineasDibujadas: [],
        tools: [{
            id: 1,
            label: "Hombre",
            class: "cuadrado"
          },
          {
            id: 2,
            label: "Mujer",
            class: "circulo"
          },
          {
            id: 3,
            label: "Recurso",
            class: "ovalo"
          },
        ],
        dialogoVisible: false,
        elementoEnEdicion: {
          nombre: "",
          edad: "",
          objetivo_relacion: [],
          tipo_relacion: "",
          elementId: null,
          principal: false,
        },
        droppedElemento: [],
        opcionesRelaciones: [],
        tipoRelaciones: ["Matrimonio", "Unión libre", "Separación", "Divorcio"],
        selectedItem: null,
        figurasObtenidas: [],
      };
    },
    mounted() {
      this.obtenerFigura()
      const toolbox = this.$refs.toolbox;
      const workspace = this.$refs.workspace;

      const drake = dragula([toolbox, workspace], {
        copy: (el, source) => source === toolbox,
        accepts: (el, target) => target === workspace,
        copySortSource: false,
        removeOnSpill: true,
      });

      drake.on("drop", (el, target, source) => {
        if (target === workspace && source === toolbox) {
          const clone = el.cloneNode(true);
          clone.classList.add("workspace-item");
          clone.style.position = "absolute";

          const workspaceRect = workspace.getBoundingClientRect();
          const elRect = el.getBoundingClientRect();

          clone.style.left = `${elRect.left - workspaceRect.left}px`;
          clone.style.top = `${elRect.top - workspaceRect.top}px`;

          workspace.appendChild(clone);
          el.remove();

          const newId = `item-${Date.now()}`;
          clone.dataset.id = newId;

          this.elementoDraggable(clone);

          this.droppedElemento.push({
            id: newId,
            element: clone,
            class: clone.querySelector("span").className,
            nombre: "",
            edad: "",
            objetivo_relacion: null,
            tipo_relacion: "",
          });

          this.actualizarOpcionesRelacion();

          clone.addEventListener("click", () => {
            this.elementoSeleccionado(newId);
          });
        }
      });

      drake.on("drag", (el) => {
        el.style.opacity = "0.5";
      });

      drake.on("dragend", (el) => {
        el.style.opacity = "1";
      });
    },
    computed: {
      esFormularioValido() {
        return this.elementoEnEdicion.nombre;
      },
    },

    methods: {
      activarDibujo() {
        this.dibujando = !this.dibujando;
      },

      comenzarDibujo(event) {
        if (!this.dibujando) return;

        this.dibujarLinea(event);
        const workspace = this.$refs.workspace;

        const onMouseMove = (e) => {
          if (this.dibujando) {
            this.dibujarLinea(e);
          }
        };

        const onMouseUp = () => {
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      },

      dibujarLinea(event) {
        const svgLayer = this.$refs.svgLayer;

        const workspaceRect = this.$refs.workspace.getBoundingClientRect();
        const x = event.clientX - workspaceRect.left;
        const y = event.clientY - workspaceRect.top;

        const line = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        line.setAttribute("cx", x);
        line.setAttribute("cy", y);
        line.setAttribute("r", 2);
        line.setAttribute("fill", "black");

        svgLayer.appendChild(line);
      },
      dejarDeDibujar() {
        this.dibujando = false;
        console.log("Modo dibujo desactivado");
      },

      obtenerNombreIcono(className) {
        switch (className) {
          case "cuadrado":
            return "mdi-square-outline";
          case "circulo":
            return "mdi-circle-outline";
          case "ovalo":
            return "mdi-diameter-outline";
          default:
            return "mdi-help";
        }
      },
      elementoDraggable(el) {
        el.addEventListener("mousedown", (event) => {
          const workspace = this.$refs.workspace;

          const offsetX = event.clientX - el.getBoundingClientRect().left;
          const offsetY = event.clientY - el.getBoundingClientRect().top;

          const onMouseMove = (moveEvent) => {
            const workspaceRect = workspace.getBoundingClientRect();
            const newX = moveEvent.clientX - workspaceRect.left - offsetX;
            const newY = moveEvent.clientY - workspaceRect.top - offsetY;

            el.style.left = `${newX}px`;
            el.style.top = `${newY}px`;

            this.actualizarConexion();
          };

          const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
          };

          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        });
      },
      elementoSeleccionado(id) {
        this.droppedElemento.forEach((item) => {
          item.element.classList.remove("selected");
        });

        const selectedItem = this.droppedElemento.find((item) => item.id === id);
        if (selectedItem) {
          selectedItem.element.classList.add("selected");
          this.selectedItem = selectedItem;
          this.abrirDialogo(id);
        }
      },
      abrirDialogo(id) {
        const item = this.droppedElemento.find((item) => item.id === id);
        if (item) {
          this.elementoEnEdicion = {
            ...item,
            elementId: id
          };
          this.dialogoVisible = true;
        }
      },
      async guardarAtributosElemento() {
        const item = this.droppedElemento.find((item) => item.id === this.elementoEnEdicion.elementId);
        if (item) {
          Object.assign(item, this.elementoEnEdicion);
          item.pos_x = event.pageX;
          item.pos_y = event.pageY;

          const figura = {
            nombre: item.nombre,
            edad: item.edad,
            consulta_id: this.datos.id,
            class: item.class,
            pos_x: item.pos_x || 0,
            pos_y: item.pos_y || 0,
          };

          if (!isNaN(Number(item.id))) {
            await this.actualizarFigura(figura);
          } else {
            await this.guardarFigura(figura, item);
          }

          if (item.objetivo_relacion && item.objetivo_relacion.length > 0) {
            await this.guardarRelacion(item);
          }

          const element = item.element;
          element.innerHTML = `
        <div>
            <small>${item.nombre}</small>
            <small>${item.edad}</small>
        </div>
        `;
          const figuraClass = `workspace-item ${item.class}`;
          element.className = item.principal ?
            `${figuraClass} borde-doble` :
            figuraClass;
          this.actualizarConexion();
        }
        this.dialogoVisible = false;
      },
      async guardarRelacion(item) {
        try {
          const relaciones = item.objetivo_relacion.map((relacionId) => ({
            figura_origen_id: item.id,
            figura_destino_id: relacionId,
            tipo_relacion: item.tipo_relacion,
          }));

          await this.$axios.post('/relaciones-ecomapa/crearRelacion', {
            relaciones
          });

          console.log("Relación guardada exitosamente");
        } catch (error) {
          console.error("Error al guardar relación:", error.response ?.data || error.message);
        }
      },
      actualizarOpcionesRelacion() {
        this.opcionesRelaciones = this.droppedElemento.map((item) => ({
          text: item.nombre || "Figura actual",
          value: item.id,
        }));
      },
      actualizarConexion() {
        const svgLayer = this.$refs.svgLayer;

        this.droppedElemento.forEach((item) => {
          if (item.objetivo_relacion && item.objetivo_relacion.length > 0) {
            const itemX = parseInt(item.element.style.left);
            const itemY = parseInt(item.element.style.top);
            const itemWidth = 70;
            const itemHeight = 70;
            const itemCenterX = itemX + itemWidth / 2;
            const itemCenterY = itemY + itemHeight / 2;

            const relatedCenters = item.objetivo_relacion.map((relatedId) => {
              const elementoRelacionado = this.droppedElemento.find((i) => i.id === relatedId);
              if (elementoRelacionado) {
                const relX = parseInt(elementoRelacionado.element.style.left);
                const relY = parseInt(elementoRelacionado.element.style.top);
                const relWidth = 70;
                const relHeight = 70;
                const relCenterX = relX + relWidth / 2;
                const relCenterY = relY + relHeight / 2;

                return {
                  x: relCenterX,
                  y: relCenterY,
                  rect: {
                    left: relX,
                    top: relY,
                    right: relX + relWidth,
                    bottom: relY + relHeight
                  },
                };
              }
              return null;
            }).filter(Boolean);

            relatedCenters.forEach((relatedCenter, index) => {
              const connectionId = `${item.id}-${relatedCenter.rect.left}-${relatedCenter.rect.top}`;

              let line = svgLayer.querySelector(`[data-connection-id="${connectionId}"]`);

              if (!line) {
                line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("data-connection-id", connectionId);
                svgLayer.appendChild(line);
              }

              line.setAttribute("x1", itemCenterX);
              line.setAttribute("y1", itemCenterY);
              line.setAttribute("x2", relatedCenter.x);
              line.setAttribute("y2", relatedCenter.y);
              line.setAttribute("stroke", "black");
              line.setAttribute("stroke-width", 2);
            });
          }
        });
      },
      getEdgePoint(x, y, width, height, targetX, targetY) {
        const rectCenterX = x + width / 2;
        const rectCenterY = y + height / 2;
        const dx = targetX - rectCenterX;
        const dy = targetY - rectCenterY;

        if (dx === 0 && dy === 0) {
          return null;
        }

        const slope = dy / dx;

        if (Math.abs(slope) > height / width) {
          const edgeY = dy > 0 ? y + height : y;
          const edgeX = rectCenterX + (edgeY - rectCenterY) / slope;
          return {
            x: edgeX,
            y: edgeY
          };
        } else {
          const edgeX = dx > 0 ? x + width : x;
          const edgeY = rectCenterY + slope * (edgeX - rectCenterX);
          return {
            x: edgeX,
            y: edgeY
          };
        }
      },
      async guardarFigura(figura, item) {
        try {
          const response = await this.$axios.post('/figuras-ecomapa/crearFigura', figura);
          figura.id = response.data.id;
          console.log("Figura guardada exitosamente:", response.data);

          item.id = figura.id;

          //   await this.obtenerFigura();

        } catch (error) {
          console.error("Error al guardar figura:", error.response ?.data || error.message);
        }
      },
      async actualizarFigura(figura) {
        try {
          const response = await this.$axios.put(`/figuras-ecomapa/${figura.id}`, figura);
          console.log("Figura actualizada exitosamente:", response.data);
        } catch (error) {
          console.error("Error al actualizar figura:", error.response ?.data || error.message);
        }
      },
      async eliminarFigura(figuraId) {
        try {
          await this.$axios.post(`/figura/eliminarFigura/${figuraId}`);
          this.droppedElemento = this.droppedElemento.filter(item => item.id !== figuraId);
          console.log("Figura eliminada exitosamente");
        } catch (error) {
          console.error("Error al eliminar figura:", error.response ?.data || error.message);
        }
      },
      async obtenerFigura() {
        try {
          const response = await this.$axios.post('/figuras-ecomapa/obtenerFigura', {
            consulta_id: this.datos.id
          });
          this.figurasObtenidas = response.data;
          this.crearFigurasObtenidas();
        } catch (error) {
          console.error("Error al guardar figura:", error.response ?.data || error.message);
        }
      },
      crearFigurasObtenidas() {
        const workspace = this.$refs.workspace;

        this.figurasObtenidas.forEach((figura) => {
          const elemento = document.createElement('div');
          console.log('creando', elemento);
          elemento.className = `workspace-item ${figura.class}`;
          const scopeId = this.$el.getAttributeNames().find(attr => attr.startsWith('data-v-'));
          if (scopeId) {
            elemento.setAttribute(scopeId, '');
          }
          elemento.style.position = 'absolute';
          //   elemento.style.left = `${figura.pos_x}px`;
          //   elemento.style.top = `${figura.pos_y}px`;
          elemento.dataset.id = figura.id;
          elemento.dataset.type = figura.class;

          elemento.innerHTML = `
        <div>
          <small>${figura.nombre}</small>
          <small>${figura.edad}</small>
        </div>
      `;

          workspace.appendChild(elemento);

          this.droppedElemento.push({
            id: figura.id,
            element: elemento,
            class: figura.class,
            nombre: figura.nombre,
            edad: figura.edad,
            objetivo_relacion: figura.objetivo_relacion || [],
            tipo_relacion: figura.tipo_relacion || '',
          });

          this.elementoDraggable(elemento);

          elemento.addEventListener('click', () => {
            this.elementoSeleccionado(figura.id);
          });
        });

        this.actualizarOpcionesRelacion();
      },

      async guardarEcomapa() {
        try {
          const workspace = this.$refs.workspace;

          const canvas = await html2canvas(workspace, {
            backgroundColor: null,
          });

          const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg"));

          if (!blob) {
            console.error("Error al generar la imagen.");
            this.$toast.error("No se pudo generar la imagen del ecomapa.");
            return;
          }

          const formData = new FormData();
          formData.append("imagen", blob, "ecomapa.jpg");
          formData.append("consulta_id", this.datos.id);
          formData.append("medico_registra", this.$store.state.auth.usuario.id);

          const guardarResponse = await this.$axios.post("figuras-ecomapa/guardarImagen", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (guardarResponse.data && guardarResponse.data.consulta_id) {
            const consultaResponse = await this.$axios.post("figuras-ecomapa/consultarImagen", {
              consulta_id: guardarResponse.data.consulta_id,
            },);
              this.imagenEcomapa = consultaResponse.data;
              this.mostrarWorkspace = false;
              this.$toast.success("Ecomapa guardado exitosamente.");
          } else {
            console.error("Error al guardar el ecomapa:", guardarResponse.data || "Respuesta inválida.");
            this.$toast.error("Hubo un problema al guardar el ecomapa.");
          }
        } catch (error) {
          console.error("Error al guardar el ecomapa:", error);
          this.$toast.error("Hubo un problema al guardar el ecomapa.");
        }
      }

    },
  };

</script>

<style scoped>
  .toolbox {
    background-color: #f5f5f5;
    padding: 10px;
    height: 100%;
  }

  .workspace {
    position: relative;
    height: 500px;
    background-color: #eaeaea;
    overflow: hidden;
    text-align: center;
  }

  .workspace-item {
    width: 70px;
    height: 70px;
    border: 2px solid black;
    text-align: center;
    line-height: 70px;
    cursor: pointer;
  }

  .circulo {
    border-radius: 50%;
  }

  .cuadrado {
    border-radius: 5%;
  }

  .ovalo {
    width: 100px;
    height: 50px;
    border-radius: 50%;
  }

  .svg-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .selected {
    border-color: blue;
  }

  .borde-doble {
    position: relative;
    border: 2px solid black;
    margin: -20px;
  }

  .borde-doble::before {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    bottom: 3px;
    border: 2px solid black;
    pointer-events: none;
  }

  .borde-doble.circulo::before {
    border-radius: 50%;
  }

  .borde-doble.cuadrado::before {
    border-radius: 5%;
  }

  .borde-doble.ovalo::before {
    transform: rotate(45deg);
  }

</style>
