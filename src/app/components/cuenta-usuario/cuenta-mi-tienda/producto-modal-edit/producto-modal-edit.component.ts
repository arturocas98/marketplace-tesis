import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MyValidators } from 'src/app/components/utils/MyValidators';
import { CategoriaService } from 'src/app/core/categoria/categoria.service';
import { SubcategoriaService } from 'src/app/core/categoria/sub_categoria.service';
import { ProductoService } from 'src/app/core/producto/producto.service';
import { Producto } from 'src/app/models/producto';
import { environment } from 'src/environments/environment';
import { DinamicRating, DinamicReviews, Tooltip, Rating, Sweetalert, Capitalize, CreateUrl } from '../../../../functions';
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-producto-modal-edit',
  templateUrl: './producto-modal-edit.component.html',
  styleUrls: ['./producto-modal-edit.component.css']
})
export class ProductoModalEditComponent implements OnInit {
  @Input() producto_id: string;
  server: string = environment.server;
  serverDelete: string = environment.serverDelete;
  path: string = environment.url_image;
  es_vendedor: boolean = false;
  preload: boolean = false;
  store: Array<any> = [];
  products: Array<any> = [];
  dtOptions: DataTables.Settings = {};
  loadProduct: number = 0;
  render: boolean = false;
  renderReview: boolean = false;
  loadReview: number = 0;
  totalReviews: any[] = [];
  idStore: string = null;
  logoStore: File = null;
  coverStore: File = null;
  imageProduct: File = null;
  defaultBannerImg: File = null;
  hSliderImg: File = null;
  hSlider: object = {

    "H4 tag": "",
    "H3-1 tag": "",
    "H3-2 tag": "",
    "H3-3 tag": "",
    "H3-4s tag": "",
    "Button tag": "",
    "IMG tag": ""
  }
  social: object = {

    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    youtube: ""

  }
  productModel: Producto;
  /*=============================================
   Configuración inicial de Summernote 
   =============================================*/

  config = {

    placeholder: '',
    tabsize: 2,
    height: '400px',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo']],
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['link', 'picture', 'hr']]
    ]

  }
  categories: any[] = [];
  subcategories: any[] = [];
  summaryGroup: any[] = [{

    input: ''

  }]
  tags: any[] = [];
  gallery: File[] = [];
  editGallery: any[] = [];
  deleteGallery: any[] = [];
  video: any[] = [];
  offer: any[] = [];
  idProducts: any[] = [];
  idProduct: string = null;
  editProductAction: boolean = false;
  validators: MyValidators;
  constructor(
    private productsService: ProductoService,
    private categoriesService: CategoriaService,
    private subCategoriesService: SubcategoriaService,
    private http: HttpClient,
    public bsModalRefEdit: BsModalRef

  ) {
    this.productModel = new Producto();
    this.validators = new MyValidators();
  }

  ngOnInit(): void {
    this.editProduct();
  }

  /*=============================================
 Editar Producto
 =============================================*/

  editProduct() {

    // this.idProduct = idProduct;

    /*=============================================
    Alerta suave mientras se carga el formulario de edición
    =============================================*/

    // Sweetalert.fnc("loading", "Cargando...", null);

    /*=============================================
    Traemos la data del producto
    =============================================*/


    this.productsService.getById(this.producto_id)
      .subscribe(resp => {
        // console.log("respuesta producto_edit:",resp);
        this.productModel.nombre = resp["nombre"];
        this.productModel.url = resp["url"];
        this.productModel.categoria = resp["categoria"];
        this.productModel.subcategoria = resp["subcategoria"];
        this.productModel.grupo = resp["grupo"];
        this.productModel.descripcion = resp["descripcion"];
        this.productModel.vistas = resp["vistas"];
        this.productModel.ventas = resp["ventas"];
        this.productModel.imagen = resp["imagen"];
        this.productModel.default_banner = resp["default_banner"];
        this.productModel.precio = resp["precio"];
        // this.productModel.shipping = resp["shipping"];
        this.productModel.tiempo_entrega = resp["tiempo_entrega"];
        this.productModel.stock = resp["stock"];

        /*=============================================
        Cargar el resumen del producto
        =============================================*/

        this.summaryGroup = [];

        JSON.parse(resp["resumen"]).forEach(value => {

          this.summaryGroup.push({

            input: value

          })

        })


        /*=============================================
        Cargar las etiquetas del producto
        =============================================*/

        JSON.parse(resp["etiquetas"]).forEach(item => {

          this.tags.push(item)

        })

        /*=============================================
        Cargar la galería del producto
        =============================================*/
        this.editGallery = [];
        JSON.parse(resp["galeria"]).forEach(item => {

          this.editGallery.push(item)

        })


        /*=============================================
        Carga del slide horizontal del producto
        =============================================*/

        this.hSlider["H4 tag"] = JSON.parse(resp["horizontal_slider"])["H4 tag"];
        this.hSlider["H3-1 tag"] = JSON.parse(resp["horizontal_slider"])["H3-1 tag"];
        this.hSlider["H3-2 tag"] = JSON.parse(resp["horizontal_slider"])["H3-2 tag"];
        this.hSlider["H3-3 tag"] = JSON.parse(resp["horizontal_slider"])["H3-3 tag"];
        this.hSlider["H3-4s tag"] = JSON.parse(resp["horizontal_slider"])["H3-4s tag"];
        this.hSlider["Button tag"] = JSON.parse(resp["horizontal_slider"])["Button tag"];
        this.hSlider["IMG tag"] = JSON.parse(resp["horizontal_slider"])["IMG tag"];

        /*=============================================
        Carga de las ofertas del producto
        =============================================*/

        if (resp["oferta"] != "") {

          JSON.parse(resp["oferta"]).forEach(value => {

            this.offer.push(value);

          })

        }

        /*=============================================
        Cerrar la Alerta suave
        =============================================*/

        // Sweetalert.fnc("close", "", null);

      })

  }


  validate(input) {

    /*=============================================
    Validamos el nombre del producto
    =============================================*/

    if ($(input).attr("name") == "productName") {

      /*=============================================
     Validamos expresión regular del nombre de la tienda
     =============================================*/

      let pattern = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]{1,}$/;

      if (!pattern.test(input.value)) {

        $(input).parent().addClass('was-validated');

        input.value = "";

        return;

      } else {

        /*=============================================
        Validamos que el nombre del producto no esté repetido
        =============================================*/
        this.productsService.getFilterDataMyStore("nombre", input.value)
          .subscribe(resp => {

            if (Object.keys(resp).length > 0) {

              $(input).parent().addClass('was-validated');
              input.value = "";
              this.productModel.url = "";

              Sweetalert.fnc("error", "El nombre del producto ya existe", null)

              return;

            } else {

              /*=============================================
             Capitulamos el nombre del producto
             =============================================*/

              input.value = Capitalize.fnc(input.value);

              /*=============================================
              Creamos la URL del producto
              =============================================*/

              this.productModel.url = CreateUrl.fnc(input.value);

            }

          })



      }


    }

    /*=============================================
    Validamos los TAGS de los Banner's y Slider's
    =============================================*/

    if ($(input).attr("tags") == "tags") {

      /*=============================================
      Validamos expresión regular
      =============================================*/

      let pattern = /^[-\\(\\)\\=\\%\\&\\$\\;\\_\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]{1,50}$/;

      if (!pattern.test(input.value)) {

        $(input).parent().addClass('was-validated');

        input.value = "";

        return;

      }

    }


    /*=============================================
    Validamos el precio de envío y el precio de venta
    =============================================*/

    // if ($(input).attr("tags") == "prices") {

    //   /*=============================================
    //   Validamos expresión regular
    //   =============================================*/

    //   let pattern = /^[.\\,\\0-9]{1,}$/;

    //   if (!pattern.test(input.value)) {

    //     $(input).parent().addClass('was-validated');

    //     return;

    //   }

    // }

    /*=============================================
   Validamos dias de entrega y stock
   =============================================*/

    if ($(input).attr("tags") == "intNumber") {

      /*=============================================
      Validamos expresión regular
      =============================================*/

      let pattern = /^[0-9]{1,}$/;

      if (!pattern.test(input.value)) {

        $(input).parent().addClass('was-validated');

        return;

      } else {

        if ($(input).attr("name") == "stock" && input.value > 100) {

          input.value = "";

          Sweetalert.fnc("error", "El producto ha excedido las 100 unidades", null)

          return;

        }

      }

    }

  }


  changeCategory(input) {

    let category = input.value.split("_")[0];

    this.subCategoriesService.getByFilter("categoria", category)
      .subscribe(resp => {

        this.subcategories = [];

        for (const i in resp) {

          this.subcategories.push(resp[i])
        }

      })

  }

  removeInput(i, type) {

    if (i > 0) {

      if (type == "summary") {

        this.summaryGroup.splice(i, 1)

      }
    }

  }

  validateImage(e, tagPicture) {
    console.log("evento:",e);
    this.imageProduct = e.target.files[0];
    switch (tagPicture) {

      case "changeLogo":
        this.logoStore = e.target.files[0];
        break;

      case "changeCover":
        this.coverStore = e.target.files[0];
        break;

      case "changeImage":
        this.imageProduct = e.target.files[0];
        break;

      case "changeDefaultBanner":
        this.defaultBannerImg = e.target.files[0];
        break;

      case "changeHSlider":
        this.hSliderImg = e.target.files[0];
        break;


    }
    console.log("Image product:",this.imageProduct);
    
    let image = e.target.files[0];

    /*=============================================
    Validamos el formato
    =============================================*/

    if (image["type"] !== "image/jpeg" && image["type"] !== "image/png") {

      Sweetalert.fnc("error", "La imagen debe ser en formato PNG o JPG", null)

      return;
    }

    /*=============================================
    Validamos el tamaño
    =============================================*/

    else if (image["size"] > 2000000) {

      Sweetalert.fnc("error", "La imagen no debe pesar más de 2MB", null)

      return;
    }

    /*=============================================
    Mostramos la imagen temporal
    =============================================*/

    else {

      let data = new FileReader();
      data.readAsDataURL(image);

      $(data).on("load", function (event) {

        let path = event.target.result;

        $(`.${tagPicture}`).attr("src", path)

      })

    }
  }


  removeGallery(pic) {

    this.editGallery.forEach((name, index) => {

      if (pic == name) {

        this.deleteGallery.push(pic);

        this.editGallery.splice(index, 1);

      }

    })

  }

  onSubmitProduct(f: NgForm) {

    /*=============================================
    Validar que el producto esté correctamente creado
    =============================================*/
    // console.log("f:",f);
    // console.log("Image product:",this.imageProduct);

    let formProduct = $(".formProduct");

    for (let i = 0; i < formProduct.length; i++) {

      if ($(formProduct[i]).val() == "" || $(formProduct[i]).val() == undefined) {

        $(formProduct[i]).parent().addClass("was-validated")

      }
    }

    /*=============================================
    Validamos que las palabras claves tenga como mínimo una sola palabra
    =============================================*/

    if (this.tags.length == 0) {

      Sweetalert.fnc("error", "La lista de etiquetas esta vacia", null);

      return;

    }

    /*=============================================
    Validamos que la galería tenga como mínimo una sola imagen
    =============================================*/


    if (this.editGallery.length == 0 && this.gallery.length == 0) {

      Sweetalert.fnc("error", "La galería esta vacía", null);

      return;

    }



    /*=============================================
    Validación completa del formulario
    =============================================*/

    if (f.invalid) {

      Sweetalert.fnc("error", "Complete los campos obligatorios", null);

      return;
    }

    /*=============================================
    Alerta suave mientras se registra la tienda y el producto
    =============================================*/

    // Sweetalert.fnc("loading", "Cargando...", null);

    /*=============================================
    Subir imagenes al servidor
    =============================================*/

    let folder = "";


    folder = this.productModel.categoria;


    let countAllImages = 0;

    let allImages = [

      {
        type: 'imageProduct',
        file: this.imageProduct,
        folder: folder,
        path: 'products/categorias',
        width: '300',
        height: '300'
      },

      {
        type: 'defaultBannerImg',
        file: this.defaultBannerImg,
        folder: `${folder}/default`,
        path: 'products/categorias',
        width: '570',
        height: '210'
      },
      {
        type: 'hSliderImg',
        file: this.hSliderImg,
        folder: `${folder}/horizontal`,
        path: 'products/categorias',
        width: '1920',
        height: '358'
      }

    ]

    for (const i in allImages) {

      const formData = new FormData();

      formData.append('file', allImages[i].file);
      formData.append('folder', allImages[i].folder);
      formData.append('path', allImages[i].path);
      formData.append('width', allImages[i].width);
      formData.append('height', allImages[i].height);

      this.http.post(this.server, formData)
        .subscribe(resp => {
          console.log("respuesta:", resp);
          if (resp["status"] != null && resp["status"] == 200) {

            if (allImages[i].type == "imageProduct") {


              /*=============================================
              Borrar antigua imagen del servidor
              =============================================*/

              const formData = new FormData();

              let fileDelete = `${allImages[i].path}/${allImages[i].folder}/${this.productModel.imagen}`;

              formData.append("fileDelete", fileDelete);

              this.http.post(this.serverDelete, formData)
                .subscribe(resp => { })

              this.productModel.imagen = resp["result"];

            }

            if (allImages[i].type == "defaultBannerImg") {


              /*=============================================
              Borrar antigua imagen del servidor
              =============================================*/

              const formData = new FormData();

              let fileDelete = `${allImages[i].path}/${allImages[i].folder}/${this.productModel.default_banner}`;

              formData.append("fileDelete", fileDelete);

              this.http.post(this.serverDelete, formData)
                .subscribe(resp => { })

              this.productModel.default_banner = resp["result"];

            }

            if (allImages[i].type == "hSliderImg") {


              /*=============================================
              Borrar antigua imagen del servidor
              =============================================*/

              const formData = new FormData();

              let fileDelete = `${allImages[i].path}/${allImages[i].folder}/${this.hSlider["IMG tag"]}`;

              formData.append("fileDelete", fileDelete);

              this.http.post(this.serverDelete, formData)
                .subscribe(resp => { })


              this.hSlider["IMG tag"] = resp["result"];

            }
          }

          countAllImages++

          /*=============================================
          Preguntamos cuando termina de subir todas las imágenes
          =============================================*/

          if (countAllImages == allImages.length) {

            /*=============================================
            Consolidar resumen del producto 
            =============================================*/

            let newSummary = [];

            for (const i in this.summaryGroup) {

              newSummary.push(this.summaryGroup[i].input);
              this.productModel.resumen = JSON.stringify(newSummary);

            }
            /*=============================================
             Consolidar palabras claves para el producto
            =============================================*/

            let newTags = [];

            for (const i in this.tags) {

              if (this.tags[i].value != undefined) {

                newTags.push(this.tags[i].value);

              } else {

                newTags.push(this.tags[i]);
              }

            }

            this.productModel.etiquetas = JSON.stringify(newTags).toLowerCase();


            /*=============================================
            Consolidar Horizontal Slider del producto
            =============================================*/

            this.productModel.horizontal_slider = JSON.stringify(this.hSlider);


            /*=============================================
            Consolidar Oferta
            =============================================*/

            if (this.offer.length > 0) {

              this.productModel.oferta = JSON.stringify(this.offer);

            } else {

              this.productModel.oferta = "[]";
            }

            /*=============================================
            Subir galería al servidor
            =============================================*/
            let countGallery = 0;
            let newGallery = [];

            /*=============================================
            Preguntamos si estamos subiendo nuevas imágenes a la galería
            =============================================*/

            if (this.gallery.length > 0) {

              /*=============================================
              Actualizar galería
              =============================================*/


              /*=============================================
              Borrar Imagen de galería del servidor
              =============================================*/

              for (const i in this.deleteGallery) {

                /*=============================================
                Borrar antigua imagen del servidor
                =============================================*/

                const formData = new FormData();

                let fileDelete = `products/categorias/${folder}/gallery/${this.deleteGallery[i]}`;

                formData.append("fileDelete", fileDelete);

                this.http.post(this.serverDelete, formData)
                  .subscribe(resp => { })

              }

              /*=============================================
              Agregar imagenes nuevas al array de la galería
              =============================================*/

              for (const i in this.editGallery) {

                newGallery.push(this.editGallery[i]);
              }


              /*=============================================
              Subimos imágenes nuevas de la galería al servidor
              =============================================*/

              for (const i in this.gallery) {

                const formData = new FormData();

                formData.append('file', this.gallery[i]);
                formData.append('folder', `${folder}/gallery`);
                formData.append('path', 'products/categorias');
                formData.append('width', '1000');
                formData.append('height', '1000');

                this.http.post(this.server, formData)
                  .subscribe(resp => {

                    if (resp["status"] != null && resp["status"] == 200) {

                      newGallery.push(resp["result"]);

                    }

                    countGallery++;

                    /*=============================================
                    Preguntamos cuando termina de subir toda la galería
                    =============================================*/

                    if (countGallery == this.gallery.length) {

                      /*=============================================
                      Consolidar los nombres de archivo de la galería
                      =============================================*/

                      this.productModel.galeria = JSON.stringify(newGallery);

                      /*=============================================
                        Editar el producto en la BD
                        =============================================*/

                      this.productsService.patchDataAuth(this.producto_id, this.productModel, localStorage.getItem("idToken"))
                        .subscribe(resp => {

                          Sweetalert.fnc("success", "El producto ha sido actualizado correctamente", "cuenta-usuario/cuenta/mi-tienda");


                        }, err => {

                          Sweetalert.fnc("error", err.error.error.message, null)

                        })


                    }


                  })

              }

            } else {

              /*=============================================
              Consolidar los nombres de archivo de la galería
              =============================================*/

              this.productModel.galeria = JSON.stringify(this.editGallery);

              /*=============================================
              Editar el producto en la BD
              =============================================*/

              this.productsService.patchDataAuth(this.producto_id, this.productModel, localStorage.getItem("idToken"))
                .subscribe(resp => {

                  Sweetalert.fnc("success", "El producto ha sido actualizado correctamente", "cuenta-usuario/cuenta/mi-tienda");


                }, err => {

                  Sweetalert.fnc("error", err.error.error.message, null)

                })

            }

          }

        })

    }



  }

  /*=============================================
  Adicionar Input's de forma dinámica
  =============================================*/

  addInput(type) {

    if (type == "summary") {

      if (this.summaryGroup.length < 5) {

        this.summaryGroup.push({

          input: ''
        })

      } else {

        Sweetalert.fnc("error", "Se superó el límite de entrada", null)

      }

    }

  }

  public validaStock(e) {
    var key = window.event ? e.which : e.keyCode;
    if (key < 48 || key > 57) {
      e.preventDefault();
    }
  }

  /*=============================================
 Funciones de Dropzone
 =============================================*/

  onSelect(event) {

    this.gallery.push(...event.addedFiles);
  }

  onRemove(event) {

    this.gallery.splice(this.gallery.indexOf(event), 1);
  }

}
