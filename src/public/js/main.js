

const socket = io();


const form = document.querySelector("form");



form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const product = {
    title: formData.get("title"),
    description: formData.get("description"),
    code: formData.get("code"),
    price: formData.get("price"),
    status: formData.get("status"),
    stock: formData.get("stock"),
    category: formData.get("category"),
  };

  socket.emit("product_send", product);
  form.reset();
});




socket.on("products_list",(data)=>{
    
    const products = document.querySelector("#tblproducts");
    
    const lstProducts = data.map((product) => {
        return `
        <tr>
                        <td class="text-center">${product.id}</td>
                        <td>${product.title}</td>
                        <td>${product.description}</td>
                        <td>${product.code}</td>
                        <td>${product.price}</td>
                        <td>${product.status}</td>
                        <td>${product.stock}</td>
                        <td>${product.category}</td>

                        <td class="td-actions text-right">
                            <button type="button" rel="tooltip" title="View " class="btn btn-info btn-simple btn-xs">
                                <i class="fa fa-user"></i>
                            </button>
                            <button type="button" rel="tooltip" title="Edit Product" class="btn btn-success btn-simple btn-xs">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button type="button" rel="tooltip" title="Remove" class="btn btn-danger btn-simple btn-xs" value="${product.id}" id="btnRemove_${product.id}">
                                <i class="fa fa-times"></i>
                            </button>
                        </td>
                    </tr>`
    });
    

    tblproducts.innerHTML = ` 
    <table class="table">
        <thead class="text-primary">
            <th class="text-center">ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Code</th>
            <th>Price</th>
            <th>Status</th>
            <th>Stock</th>
            <th>Category</th>
            <th class="text-right">Actions</th>
        </thead>
        <tbody>
            ${lstProducts.join('')}
        </tbody>
    </table>`;

    data.forEach(product => {
        const btnRemove = document.getElementById(`btnRemove_${product.id}`);
        
        btnRemove.addEventListener("click", function() {
          const productId = this.value;
          // Ahora puedes utilizar productId, que es el valor del botón "Remove" clickeado
          console.log(`Botón Remove clickeado para el producto con ID: ${productId}`);
          
          // Aquí puedes realizar acciones adicionales según sea necesario
          socket.emit("product_delete", productId);
        });
      });

})