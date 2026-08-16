const db = require("./database");

const express=require("express");
const app=express();

const swaggerUi=require("swagger-ui-express");
const swaggerDocument=require("./openapi.json");

const PORT=3000;

app.use(express.json());

app.get('/',(req,res)=>{
    res.json({
        name:"Task API",
        version:'1.0',
        endpoints:["/tasks"]
    });
});

app.get("/health",(req,res)=>{
    res.json({
        status:'OK'
    });
});

app.get('/tasks',(req,res)=>{
    const tasks=db.prepare("SELECT * FROM tasks").all();
    res.json(tasks);
});

app.get('/tasks/:id',(req,res)=>{
    const id=Number(req.params.id);

    const task=db.prepare("SELECT * FROM tasks WHERE id= ?").get(id);

    if(!task){
        return res.status(404).json({
            error:`Task ${id} not found`
        });
    }
    return res.json(task);
});

app.post('/tasks',(req,res)=>{
    const {title}=req.body;

    if(!title || title.trim()===''){
        return res.status(400).json({
            error:`Title is needed`
        });
    }
    const result=db
            .prepare("INSERT INTO tasks (title,done) VALUES (?,?)")
            .run(title,0);

    const task=db.prepare("SELECT * FROM tasks where id=?").get(result.lastInsertRowid);
    res.status(201).json(task);
});

app.put('/tasks/:id',(req,res)=>{
    const id=Number(req.params.id);
    const {title,done}=req.body;

    const existingTask=db.prepare(`SELECT * FROM tasks WHERE id= ?`).get(id);

    if(!existingTask){
        return res.status(404).json({
            error:"Task not found"
        })
    }
   
    if(title===undefined && done===undefined){
        return res.status(400).json({
            error:"Nothing to update"
        })
    }

    if(title!==undefined){
        if(typeof title!=='string' || title.trim()===''){
            return res.status(400).json({
                error:"Task must be non-empty string"
            })
        }
    }
    const newTitle= title!==undefined?title:existingTask.title;
    const newDone= done!==undefined?done:existingTask.done;

    db.prepare(`UPDATE tasks SET title=? ,done=? WHERE id=?`).run(newTitle,newDone,id);
    
    const updatedTask=db.prepare(`SELECT * FROM tasks WHERE id=?`).get(id);

    res.json(updatedTask); 
})

app.delete("/tasks/:id",(req,res)=>{
    const id=Number(req.params.id);

    const result=db.prepare(`DELETE FROM tasks WHERE id=?`).run(id);

    console.log("Deleting ID:", id);
    console.log("Rows deleted:", result.changes);

    if(result.changes===0){
        return res.status(404).json({
            error:"Task not found"
        })
    }
    return res.sendStatus(204);
});


app.use('/docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument));

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});
