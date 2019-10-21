package com.example.arken.fragment;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.navigation.Navigation;

import com.example.arken.R;
import com.example.arken.activity.MainActivity;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;

import static androidx.navigation.fragment.NavHostFragment.findNavController;

public class BaseFragment extends Fragment {
    private ImageButton eventPage;
    private ImageButton signOut;
    private Fragment fragment;
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_base, container, false);
        FragmentManager f = getChildFragmentManager();
        fragment = f.findFragmentById(R.id.nav_host_base_fragment);
        eventPage = view.findViewById(R.id.menu_event);
        eventPage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(findNavController(fragment).getCurrentDestination().getId() == R.id.eventListFragment){
                    findNavController(fragment).navigate(R.id.action_eventListFragment_self);

                }
            }
        });
        signOut = view.findViewById(R.id.menu_logout);
        signOut.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                MainActivity.getClient().signOut().addOnCompleteListener(new OnCompleteListener<Void>() {
                    @Override
                    public void onComplete(@NonNull Task<Void> task) {
                        if(Navigation.findNavController(signOut).getCurrentDestination().getId() == R.id.baseFragment)
                            Navigation.findNavController(signOut).navigate(R.id.action_baseFragment_to_startFragment);

                    }
                });
            }
        });
        return view;
    }
}
