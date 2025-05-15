import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../components/ui/use-toast";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o painel administrativo...",
        duration: 1000,
      });

      navigate("/admin");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cps-wine to-cps-wine/90 text-white md:py-10 py-[20px] px-[25px]">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Title com efeito decorativo */}
            <div className="text-center md:text-left order-2 md:order-1 relative">
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white/30 rounded-tl-lg -mt-3 -ml-3 hidden md:block"></div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold drop-shadow-sm">
                Área Administrativa
              </h1>
              <div className="w-20 h-1 bg-white/70 mx-auto md:mx-0 my-3 rounded-full"></div>
              <p className="text-white/90 text-sm md:text-base max-w-xl">
                Acesso restrito para gerenciamento do evento
              </p>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white/30 rounded-br-lg -mb-3 -mr-3 hidden md:block"></div>
            </div>
            
            {/* Icon com efeito de brilho */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-4 md:mb-0 order-1 md:order-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-50/30 to-transparent animate-pulse"></div>
              <img 
                src="/lovable-uploads/46413f67-28f7-49ff-a512-9b2eed73faf3.png" 
                alt="Logo CPS" 
                className="h-16 md:h-24 w-auto relative z-10" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Login Form Section */}
      <section className="flex-grow flex items-center justify-center py-8 px-4">
        <Card className="w-full max-w-[400px]">
          <CardHeader>
            <div className="flex flex-col justify-center items-center text-center">
              <CardTitle className="text-xl md:text-2xl font-bold text-cps-wine">
                Login Administrativo
              </CardTitle>
              <div className="w-16 h-1 bg-cps-wine rounded-full my-2"></div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-cps-wine hover:bg-cps-wine/90 text-white"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
