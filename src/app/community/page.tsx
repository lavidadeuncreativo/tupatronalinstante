"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Heart, MessageSquare, UploadCloud, User } from "lucide-react";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";

interface CommunityPost {
    id: string;
    author: string;
    title: string;
    description: string;
    imageUrl: string;
    likes: number;
    date: string;
}

export default function CommunityPage() {
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [author, setAuthor] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    // Mock initial data if empty
    useEffect(() => {
        const storedPosts = localStorage.getItem("community_posts");
        if (storedPosts) {
            setPosts(JSON.parse(storedPosts));
        } else {
            const initialPosts: CommunityPost[] = [
                {
                    id: "1",
                    author: "Maria L.",
                    title: "Amigurumi Osito",
                    description: "Hice este osito usando el modo exacto. ¡Quedó perfecto de 15cm!",
                    imageUrl: "https://placehold.co/400x400/png?text=Osito",
                    likes: 24,
                    date: new Date().toISOString()
                },
                {
                    id: "2",
                    author: "Juan P.",
                    title: "Gorro de Lana",
                    description: "Patrón generado desde una foto de Pinterest. Muy fácil de seguir.",
                    imageUrl: "https://placehold.co/400x400/png?text=Gorro",
                    likes: 15,
                    date: new Date(Date.now() - 86400000).toISOString()
                }
            ];
            setPosts(initialPosts);
            localStorage.setItem("community_posts", JSON.stringify(initialPosts));
        }
    }, []);

    const onDrop = (acceptedFiles: File[]) => {
        const f = acceptedFiles[0];
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!author || !title || !description || !file) {
            toast.error("Por favor completa todos los campos e incluye una imagen.");
            return;
        }

        setIsSubmitting(true);

        // Simulate upload and delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            const newPost: CommunityPost = {
                id: Date.now().toString(),
                author,
                title,
                description,
                imageUrl: base64, // Storing base64 in localstorage is heavy but ok for demo
                likes: 0,
                date: new Date().toISOString()
            };

            const updatedPosts = [newPost, ...posts];
            setPosts(updatedPosts);
            localStorage.setItem("community_posts", JSON.stringify(updatedPosts));

            setIsSubmitting(false);
            setAuthor("");
            setTitle("");
            setDescription("");
            setFile(null);
            setPreview(null);
            toast.success("¡Tu proyecto ha sido publicado!");
        };
        reader.readAsDataURL(file);
    };

    const handleLike = (id: string) => {
        const updatedPosts = posts.map(post => {
            if (post.id === id) {
                return { ...post, likes: post.likes + 1 };
            }
            return post;
        });
        setPosts(updatedPosts);
        localStorage.setItem("community_posts", JSON.stringify(updatedPosts));
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-primary cursor-pointer">
                        <Link href="/">Patrón al instante</Link>
                    </div>
                    <nav className="flex gap-4 text-sm font-medium">
                        <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Inicio</Link>
                        <Link href="/app" className="text-muted-foreground hover:text-primary transition-colors">Generador</Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1 container mx-auto p-4 max-w-5xl py-8">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Comunidad de Creadores</h1>
                    <p className="text-xl text-muted-foreground">Inspírate con los proyectos de otros tejedores y comparte los tuyos.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Feed */}
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="text-2xl font-semibold mb-4">Proyectos Recientes</h2>
                        {posts.map(post => (
                            <Card key={post.id} className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="grid md:grid-cols-5 gap-0">
                                        <div className="md:col-span-2 bg-muted/20 h-48 md:h-auto relative group">
                                            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover absolute inset-0" />
                                        </div>
                                        <div className="md:col-span-3 p-6 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                                                    <User className="h-4 w-4" />
                                                    <span className="font-medium text-primary">{post.author}</span>
                                                    <span>•</span>
                                                    <span>{new Date(post.date).toLocaleDateString()}</span>
                                                </div>
                                                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                                                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                                                    {post.description}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="gap-2 hover:text-red-500"
                                                    onClick={() => handleLike(post.id)}
                                                >
                                                    <Heart className={`h-4 w-4 ${post.likes > 0 ? 'fill-current' : ''}`} />
                                                    {post.likes}
                                                </Button>
                                                <Button variant="ghost" size="sm" className="gap-2">
                                                    <MessageSquare className="h-4 w-4" />
                                                    Comentar
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Submission Form */}
                    <div className="md:col-span-1">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Sube tu Proyecto</CardTitle>
                                <CardDescription>Comparte tu resultado con la comunidad.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Título del Proyecto</Label>
                                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Gorro de invierno" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="author">Tu Nombre</Label>
                                        <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Ej: Ana G." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Descripción y Tips</Label>
                                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="¿Qué estambre usaste? ¿Algún consejo?" className="min-h-[100px]" />
                                    </div>

                                    <div
                                        {...getRootProps()}
                                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}`}
                                    >
                                        <input {...getInputProps()} />
                                        {preview ? (
                                            <div className="relative">
                                                <img src={preview} alt="Preview" className="max-h-32 mx-auto rounded-md shadow-sm" />
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFile(null);
                                                        setPreview(null);
                                                    }}
                                                >
                                                    x
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
                                                <UploadCloud className="h-8 w-8" />
                                                <p>Sube foto del resultado</p>
                                            </div>
                                        )}
                                    </div>

                                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Publicando...
                                            </>
                                        ) : (
                                            "Publicar Proyecto"
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
