// Copie este arquivo para:
//   android/app/src/main/java/br/edu/ifba/si/corridabug/MainActivity.java
// (substituindo o que o Capacitor gerou). O pacote abaixo precisa ser igual ao appId.
package br.edu.ifba.si.corridabug;

import android.os.Bundle;
import android.view.WindowManager;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Mantém a tela sempre ligada enquanto o jogo estiver aberto (ideal para o stand)
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        ativarModoImersivo();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        // O Android mostra as barras de novo em alguns casos (ex.: ao voltar de outro app)
        if (hasFocus) ativarModoImersivo();
    }

    /** Esconde a barra de status e a barra de navegação (modo imersivo). */
    private void ativarModoImersivo() {
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        WindowInsetsControllerCompat controle =
            WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        controle.hide(WindowInsetsCompat.Type.systemBars());
        // As barras só reaparecem por alguns segundos se a pessoa deslizar da borda
        controle.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
    }
}
